"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export type Gender = "male" | "female" | "other";

export type FamilyMember = {
  id: string;
  name: string;
  gender: Gender;
  parentId: string | null;
  spouseId: string | null;
  photo: string | null;
};

type FamilyTreeCanvasProps = {
  familyTree: FamilyMember[];
  onChange: (familyTree: FamilyMember[]) => void;
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

type FamilyMemberFormState = {
  name: string;
  gender: Gender;
  parentId: string;
  spouseId: string;
  photo: string | null;
};

type FamilyMemberFormProps = {
  isEdit: boolean;
  form: FamilyMemberFormState;
  members: FamilyMember[];
  spouseOptions: FamilyMember[];
  parentOptions: FamilyMember[];
  updateForm: <K extends keyof FamilyMemberFormState>(
    key: K,
    value: FamilyMemberFormState[K],
  ) => void;
};

const PALETTE = [
  "#e8734a",
  "#4a9e8a",
  "#7b6fa0",
  "#e8a84a",
  "#4a7eb5",
  "#c05c7e",
  "#5c9e5c",
  "#9e5c5c",
  "#3a8a9e",
  "#a07030",
];

const C = {
  bg: "#f9f6f1",
  navy: "#274877",
  border: "#e2ddd6",
  text: "#1a1a2e",
  muted: "#8a8278",
  card: "#fff",
};

const NW = 110;
const NH = 112;
const HGAP = 28;
const VGAP = 70;

let idSeed = 1;
const uid = () => `m${idSeed++}`;
const color = (id: string) =>
  PALETTE[parseInt(id.replace(/\D/g, ""), 10) % PALETTE.length] ?? PALETTE[0];
const initials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

function deriveRelation(
  member: FamilyMember,
  allMembers: FamilyMember[],
  visited = new Set<string>(),
): string {
  const map: Record<string, FamilyMember> = {};
  allMembers.forEach((item) => {
    map[item.id] = item;
  });

  if (visited.has(member.id)) return "Relative";
  visited.add(member.id);

  if (!member.parentId && !member.spouseId) return "Root";

  const parent = member.parentId ? map[member.parentId] : undefined;
  const spouse = member.spouseId ? map[member.spouseId] : undefined;

  if (!parent && spouse) {
    const spouseRelation = deriveRelation(spouse, allMembers, new Set(visited));
    if (member.gender === "female")
      return spouseRelation === "Root" ? "Wife" : "Spouse";
    if (member.gender === "male")
      return spouseRelation === "Root" ? "Husband" : "Spouse";
    return "Spouse";
  }

  if (!parent) return "Root";

  const parentRelation = deriveRelation(parent, allMembers, new Set(visited));
  const relation = (male: string, female: string, other?: string) =>
    member.gender === "male"
      ? male
      : member.gender === "female"
        ? female
        : (other ?? female);

  switch (parentRelation) {
    case "Root":
      return relation("Son", "Daughter", "Child");
    case "Son":
    case "Daughter":
    case "Child":
      return relation("Grandson", "Granddaughter", "Grandchild");
    case "Grandson":
    case "Granddaughter":
    case "Grandchild":
      return relation(
        "Great-Grandson",
        "Great-Granddaughter",
        "Great-Grandchild",
      );
    case "Husband":
    case "Wife":
    case "Spouse":
      return relation("Son", "Daughter", "Child");
    case "Father":
    case "Mother":
      return relation("Uncle", "Aunt", "Parent's sibling");
    default:
      return relation("Relative", "Relative", "Relative");
  }
}

function subtreeWidth(id: string, map: Record<string, FamilyMember>): number {
  const node = map[id];
  if (!node) return NW;
  const kids = Object.values(map).filter((member) => member.parentId === id);
  if (!kids.length) return NW;
  const total =
    kids.reduce((sum, child) => sum + subtreeWidth(child.id, map), 0) +
    HGAP * (kids.length - 1);
  return Math.max(NW, total);
}

function placeNodes(
  id: string,
  x: number,
  y: number,
  map: Record<string, FamilyMember>,
  positions: Record<string, { x: number; y: number }>,
) {
  const node = map[id];
  if (!node) return NW;
  const kids = Object.values(map).filter((member) => member.parentId === id);

  if (!kids.length) {
    positions[id] = { x, y };
    return NW;
  }

  const childWidths = kids.map((child) => subtreeWidth(child.id, map));
  const totalWidth =
    childWidths.reduce((sum, width) => sum + width, 0) +
    HGAP * (kids.length - 1);
  const subtreeWidthValue = Math.max(NW, totalWidth);
  positions[id] = { x: x + subtreeWidthValue / 2 - NW / 2, y };

  let currentX = x + subtreeWidthValue / 2 - totalWidth / 2;
  kids.forEach((child, index) => {
    placeNodes(child.id, currentX, y + NH + VGAP, map, positions);
    currentX += childWidths[index] + HGAP;
  });

  return subtreeWidthValue;
}

function buildLayout(members: FamilyMember[]) {
  const map: Record<string, FamilyMember> = {};
  members.forEach((member) => {
    map[member.id] = member;
  });

  const roots = members.filter((member) => !member.parentId);
  const positions: Record<string, { x: number; y: number }> = {};
  let currentX = 0;

  roots.forEach((root) => {
    const subtreeWidthValue = subtreeWidth(root.id, map);
    placeNodes(root.id, currentX, 0, map, positions);

    if (root.spouseId && map[root.spouseId] && !map[root.spouseId].parentId) {
      const spouse = map[root.spouseId];
      if (!positions[spouse.id]) {
        const rootPos = positions[root.id];
        if (rootPos) {
          positions[spouse.id] = { x: rootPos.x + NW + HGAP, y: rootPos.y };
        }
      }
    }

    currentX += subtreeWidthValue + HGAP * 3;
  });

  members.forEach((member) => {
    if (
      !positions[member.id] &&
      member.spouseId &&
      positions[member.spouseId]
    ) {
      const spousePos = positions[member.spouseId];
      positions[member.id] = { x: spousePos.x + NW + HGAP, y: spousePos.y };
    }
  });

  let maxX = 0;
  let maxY = 0;
  Object.values(positions).forEach((position) => {
    maxX = Math.max(maxX, position.x + NW);
    maxY = Math.max(maxY, position.y + NH);
  });

  return { positions, width: maxX + 40, height: maxY + 40 };
}

function TreeNode({
  member,
  pos,
  selected,
  onSelect,
  relation,
  isPublic,
}: {
  member: FamilyMember;
  pos: { x: number; y: number };
  selected: boolean;
  onSelect: (id: string) => void;
  relation: string;
  isPublic: boolean;
}) {
  const radius = 26;
  const cx = pos.x + NW / 2;
  const cy = pos.y + radius + 4;
  const fill = color(member.id);

  return (
    <g
      onClick={() => !isPublic && onSelect(member.id)}
      style={{ cursor: isPublic ? "default" : "pointer" }}
    >
      {selected ? (
        <circle cx={cx} cy={cy} r={radius + 7} fill={fill} opacity={0.15} />
      ) : null}
      <clipPath id={`clip-${member.id}`}>
        <circle cx={cx} cy={cy} r={radius} />
      </clipPath>
      {member.photo ? (
        <image
          href={member.photo}
          x={cx - radius}
          y={cy - radius}
          width={radius * 2}
          height={radius * 2}
          clipPath={`url(#clip-${member.id})`}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <>
          <circle cx={cx} cy={cy} r={radius} fill={fill} />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={13}
            fontWeight="700"
            fill="#fff"
            fontFamily="Georgia,serif"
          >
            {initials(member.name)}
          </text>
        </>
      )}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={selected ? C.navy : "#fff"}
        strokeWidth={selected ? 2.5 : 2}
      />
      <text
        x={cx}
        y={pos.y + radius * 2 + 14}
        textAnchor="middle"
        fontSize={11.5}
        fontWeight="700"
        fill={C.text}
        fontFamily="Georgia,serif"
      >
        {member.name}
      </text>
      <text
        x={cx}
        y={pos.y + radius * 2 + 27}
        textAnchor="middle"
        fontSize={10}
        fill={C.muted}
        fontFamily="Georgia,serif"
      >
        {relation}
      </text>
    </g>
  );
}

function TreeSVG({
  members,
  selectedId,
  onSelect,
  isPublic,
}: {
  members: FamilyMember[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isPublic: boolean;
}) {
  if (!members.length) return null;
  const { positions, width, height } = buildLayout(members);

  const lines: ReactNode[] = [];
  members.forEach((member) => {
    if (member.parentId && positions[member.id] && positions[member.parentId]) {
      const fromPos = positions[member.parentId];
      const toPos = positions[member.id];
      const fromX = fromPos.x + NW / 2;
      const fromY = fromPos.y + 62;
      const toX = toPos.x + NW / 2;
      const toY = toPos.y + 4;
      const middleY = (fromY + toY) / 2;
      lines.push(
        <path
          key={`p-${member.id}`}
          d={`M ${fromX} ${fromY} C ${fromX} ${middleY}, ${toX} ${middleY}, ${toX} ${toY}`}
          fill="none"
          stroke={C.navy}
          strokeWidth={1.6}
          opacity={0.4}
        />,
      );
    }

    if (
      member.spouseId &&
      positions[member.id] &&
      positions[member.spouseId] &&
      member.id < member.spouseId
    ) {
      const aPos = positions[member.id];
      const bPos = positions[member.spouseId];
      const aY = aPos.y + 30;
      const bY = bPos.y + 30;
      const aX = aPos.x + NW;
      const bX = bPos.x;
      const midX = (aX + bX) / 2;
      lines.push(
        <line
          key={`s-${member.id}`}
          x1={aX}
          y1={aY}
          x2={bX}
          y2={bY}
          stroke={C.navy}
          strokeWidth={1.6}
          opacity={0.35}
          strokeDasharray="4 3"
        />,
      );
      lines.push(
        <text
          key={`h-${member.id}`}
          x={midX}
          y={aY + 5}
          textAnchor="middle"
          fontSize={10}
          fill="#e8734a"
        >
          ♥
        </text>,
      );
    }
  });

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 460 }}>
      <svg
        width={Math.max(width, 300)}
        height={Math.max(height, 160)}
        style={{ display: "block" }}
      >
        {lines}
        {members.map((member) => {
          const pos = positions[member.id];
          if (!pos) return null;
          return (
            <TreeNode
              key={member.id}
              member={member}
              pos={pos}
              selected={selectedId === member.id}
              relation={deriveRelation(member, members)}
              onSelect={onSelect}
              isPublic={isPublic}
            />
          );
        })}
      </svg>
    </div>
  );
}

function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(20,20,40,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: C.card,
          borderRadius: 20,
          padding: "1.75rem",
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          border: `1px solid ${C.border}`,
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: C.navy,
              fontFamily: "Georgia,serif",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            type="button"
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: C.muted,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const INPUT_STYLE: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: `1.5px solid ${C.border}`,
  borderRadius: 10,
  padding: "9px 13px",
  fontSize: 13,
  fontFamily: "Georgia,serif",
  color: C.text,
  background: C.bg,
  outline: "none",
};

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          color: C.muted,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  full,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "active";
  disabled?: boolean;
  full?: boolean;
  style?: CSSProperties;
}) {
  const variants: Record<string, CSSProperties> = {
    primary: { background: C.navy, color: "#fff", border: "none" },
    ghost: {
      background: "transparent",
      color: C.navy,
      border: `1.5px solid ${C.border}`,
    },
    danger: {
      background: "#fff5f5",
      color: "#c0392b",
      border: "1.5px solid #f5c6c6",
    },
    active: {
      background: `${C.navy}22`,
      color: C.navy,
      border: `1.5px solid ${C.navy}44`,
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        borderRadius: 10,
        padding: "9px 18px",
        fontSize: 13,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "Georgia,serif",
        letterSpacing: "0.02em",
        width: full ? "100%" : undefined,
        transition: "all 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function PhotoPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (readerEvent) =>
      onChange(readerEvent.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: value ? "transparent" : C.bg,
          border: `2px dashed ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {value ? (
          <img
            src={value}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt=""
          />
        ) : (
          <span style={{ fontSize: 22, color: C.muted }}>＋</span>
        )}
      </div>
      <div>
        <Btn
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          style={{ padding: "6px 14px", fontSize: 12 }}
        >
          {value ? "Change Photo" : "Upload Photo"}
        </Btn>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{
              marginLeft: 8,
              background: "none",
              border: "none",
              fontSize: 11,
              color: C.muted,
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}

function FamilyMemberFormFields({
  isEdit,
  form,
  members,
  spouseOptions,
  parentOptions,
  updateForm,
}: FamilyMemberFormProps) {
  const spouseList = isEdit
    ? spouseOptions
    : members.filter((member) => !member.spouseId);
  const parentList = isEdit ? parentOptions : members;

  return (
    <>
      <Field label="Full Name *">
        <input
          style={INPUT_STYLE}
          value={form.name}
          placeholder="e.g. Margaret Thompson"
          onChange={(event) => updateForm("name", event.target.value)}
        />
      </Field>
      <Field label="Gender">
        <div style={{ display: "flex", gap: 8 }}>
          {(["male", "female", "other"] as Gender[]).map((gender) => (
            <Btn
              key={gender}
              variant={form.gender === gender ? "active" : "ghost"}
              onClick={() => updateForm("gender", gender)}
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              {gender}
            </Btn>
          ))}
        </div>
      </Field>
      <Field label="Photo (optional)">
        <PhotoPicker
          value={form.photo}
          onChange={(value) => updateForm("photo", value)}
        />
      </Field>
      <Field
        label="Parent"
        hint="Leave empty if this is a root (top-level) person"
      >
        <select
          style={{ ...INPUT_STYLE, appearance: "none" }}
          value={form.parentId}
          onChange={(event) => updateForm("parentId", event.target.value)}
        >
          <option value="">— No parent (root) —</option>
          {parentList.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} · {deriveRelation(member, members)}
            </option>
          ))}
        </select>
      </Field>
      <Field
        label="Spouse / Partner"
        hint="Links two people with a dashed line"
      >
        <select
          style={{ ...INPUT_STYLE, appearance: "none" }}
          value={form.spouseId}
          onChange={(event) => updateForm("spouseId", event.target.value)}
        >
          <option value="">— No spouse —</option>
          {spouseList.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </Field>
      {form.name || form.parentId ? (
        <div
          style={{
            background: C.bg,
            borderRadius: 10,
            padding: "10px 14px",
            border: `1px solid ${C.border}`,
            marginBottom: "1rem",
            fontSize: 13,
            color: C.muted,
          }}
        >
          Will appear as:{" "}
          <b style={{ color: C.navy }}>
            {deriveRelation(
              {
                id: "_preview",
                name: form.name,
                gender: form.gender,
                parentId: form.parentId || null,
                spouseId: form.spouseId || null,
                photo: form.photo,
              },
              [
                ...members,
                {
                  id: "_preview",
                  name: form.name,
                  gender: form.gender,
                  parentId: form.parentId || null,
                  spouseId: form.spouseId || null,
                  photo: form.photo,
                },
              ],
            )}
          </b>
        </div>
      ) : null}
    </>
  );
}

export default function FamilyTreeCanvas({
  familyTree,
  onChange,
}: FamilyTreeCanvasProps) {
  const members = familyTree;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const blankForm: FamilyMemberFormState = {
    name: "",
    gender: "female",
    parentId: "",
    spouseId: "",
    photo: null,
  };
  const [form, setForm] = useState<FamilyMemberFormState>(blankForm);

  const map: Record<string, FamilyMember> = {};
  members.forEach((member) => {
    map[member.id] = member;
  });

  const updateForm = <K extends keyof FamilyMemberFormState>(
    key: K,
    value: FamilyMemberFormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openAdd = () => {
    setForm(blankForm);
    setAddOpen(true);
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const id = uid();
    const newMember: FamilyMember = {
      id,
      name: form.name.trim(),
      gender: form.gender,
      parentId: form.parentId || null,
      spouseId: form.spouseId || null,
      photo: form.photo,
    };
    const updated = [...members, newMember];
    if (form.spouseId) {
      const index = updated.findIndex((member) => member.id === form.spouseId);
      if (index !== -1) updated[index] = { ...updated[index], spouseId: id };
    }
    onChange(updated);
    setAddOpen(false);
  };

  const openEdit = (id: string) => {
    const member = map[id];
    if (!member) return;
    setSelectedId(id);
    setForm({
      name: member.name,
      gender: member.gender,
      parentId: member.parentId ?? "",
      spouseId: member.spouseId ?? "",
      photo: member.photo ?? null,
    });
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!selectedId || !form.name.trim()) return;
    let updated = members.map((member) =>
      member.id === selectedId
        ? {
            ...member,
            name: form.name.trim(),
            gender: form.gender,
            parentId: form.parentId || null,
            spouseId: form.spouseId || null,
            photo: form.photo ?? null,
          }
        : member,
    );
    const oldSpouse = map[selectedId]?.spouseId;
    if (oldSpouse && oldSpouse !== form.spouseId) {
      updated = updated.map((member) =>
        member.id === oldSpouse ? { ...member, spouseId: null } : member,
      );
    }
    if (form.spouseId) {
      updated = updated.map((member) =>
        member.id === form.spouseId
          ? { ...member, spouseId: selectedId }
          : member,
      );
    }
    onChange(updated);
    setEditOpen(false);
  };

  const handleDelete = (id: string) => {
    const target = map[id];
    let updated = members.filter((member) => member.id !== id);
    updated = updated.map((member) =>
      member.parentId === id
        ? { ...member, parentId: target?.parentId ?? null }
        : member,
    );
    if (target?.spouseId) {
      const index = updated.findIndex(
        (member) => member.id === target.spouseId,
      );
      if (index !== -1) updated[index] = { ...updated[index], spouseId: null };
    }
    onChange(updated);
    setSelectedId(null);
    setDeleteId(null);
  };

  const selected = selectedId ? map[selectedId] : null;
  const spouseOptions = members.filter(
    (member) =>
      member.id !== selectedId &&
      (!member.spouseId || member.spouseId === selectedId),
  );
  const parentOptions = members.filter((member) => member.id !== selectedId);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "Georgia,serif",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: C.navy,
                letterSpacing: "-0.02em",
              }}
            >
              Family Tree
            </h1>
            <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>
              {members.length} member{members.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                style={{
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  background: !isPublic ? C.navy : "transparent",
                  color: !isPublic ? "#fff" : C.muted,
                  fontFamily: "Georgia,serif",
                  transition: "all 0.15s",
                }}
              >
                ✎ Edit
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                style={{
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  background: isPublic ? C.navy : "transparent",
                  color: isPublic ? "#fff" : C.muted,
                  fontFamily: "Georgia,serif",
                  transition: "all 0.15s",
                }}
              >
                👁 Public
              </button>
            </div>
            {!isPublic ? <Btn onClick={openAdd}>＋ Add Member</Btn> : null}
          </div>
        </div>

        <div
          style={{
            background: C.card,
            borderRadius: 20,
            border: `1px solid ${C.border}`,
            padding: "1.5rem 1rem",
            boxShadow: "0 4px 24px rgba(39,72,119,0.07)",
            minHeight: 220,
          }}
        >
          {members.length === 0 ? (
            <div
              style={{ textAlign: "center", color: C.muted, padding: "4rem 0" }}
            >
              <div style={{ fontSize: 52, marginBottom: 12 }}>🌳</div>
              <p style={{ fontSize: 15, marginBottom: "1rem" }}>
                Start building your family tree
              </p>
              <Btn onClick={openAdd}>＋ Add First Member</Btn>
            </div>
          ) : (
            <TreeSVG
              members={members}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(selectedId === id ? null : id)}
              isPublic={isPublic}
            />
          )}
        </div>

        {!isPublic && selected ? (
          <div
            style={{
              marginTop: "1rem",
              background: C.card,
              borderRadius: 16,
              border: `1.5px solid ${C.navy}22`,
              padding: "1.1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              boxShadow: "0 2px 12px rgba(39,72,119,0.07)",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                flexShrink: 0,
                overflow: "hidden",
                background: color(selected.id),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              {selected.photo ? (
                <img
                  src={selected.photo}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt=""
                />
              ) : (
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
                  {initials(selected.name)}
                </span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
                {selected.name}
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>
                {deriveRelation(selected, members)}
                {selected.spouseId && map[selected.spouseId]
                  ? ` · Spouse: ${map[selected.spouseId].name}`
                  : null}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={() => openEdit(selected.id)}>
                Edit
              </Btn>
              <Btn variant="danger" onClick={() => setDeleteId(selected.id)}>
                Remove
              </Btn>
            </div>
          </div>
        ) : null}

        {isPublic && members.length > 0 ? (
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
              padding: "0.75rem 1rem",
              background: C.card,
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              fontSize: 12,
              color: C.muted,
            }}
          >
            <span>— — — Spouse/Partner</span>
            <span>——— Parent-Child</span>
            <span>♥ Couple link</span>
          </div>
        ) : null}
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Family Member"
      >
        <FamilyMemberFormFields
          isEdit={false}
          form={form}
          members={members}
          spouseOptions={spouseOptions}
          parentOptions={parentOptions}
          updateForm={updateForm}
        />
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            paddingTop: "0.5rem",
          }}
        >
          <Btn variant="ghost" onClick={() => setAddOpen(false)}>
            Cancel
          </Btn>
          <Btn disabled={!form.name.trim()} onClick={handleAdd}>
            Add to Tree
          </Btn>
        </div>
      </Modal>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Member"
      >
        <FamilyMemberFormFields
          isEdit={true}
          form={form}
          members={members}
          spouseOptions={spouseOptions}
          parentOptions={parentOptions}
          updateForm={updateForm}
        />
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            paddingTop: "0.5rem",
          }}
        >
          <Btn variant="ghost" onClick={() => setEditOpen(false)}>
            Cancel
          </Btn>
          <Btn disabled={!form.name.trim()} onClick={handleEdit}>
            Save Changes
          </Btn>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Remove Member?"
      >
        <p
          style={{
            color: C.muted,
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}
        >
          <b style={{ color: C.text }}>{deleteId ? map[deleteId]?.name : ""}</b>{" "}
          will be removed. Their children move up one level.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setDeleteId(null)}>
            Cancel
          </Btn>
          {deleteId ? (
            <Btn variant="danger" onClick={() => handleDelete(deleteId)}>
              Yes, Remove
            </Btn>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
