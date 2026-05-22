import type { FuneralAdviceArticle, SponsoredCard } from "./types";

const rowOneArticles: FuneralAdviceArticle[] = [
  {
    id: "first-24-hours",
    label: "Planning",
    title: "What to do in the first 24 hours after a death",
    summary:
      "A clear, practical guide for the first day so families can focus on people, paperwork, and immediate decisions without feeling rushed.",
    image: "/Source/Banner.jpg",
    intro:
      "The first day after a death is usually a blur of phone calls, waiting rooms, travel, and decisions that arrive before anyone feels ready. A helpful plan does not remove grief, but it does reduce confusion. It gives the family a sequence to follow, protects them from avoidable pressure, and makes room for dignity in a moment that can otherwise feel scattered.",
    sections: [
      {
        heading: "Start with the people closest to the deceased",
        paragraphs: [
          "Begin by confirming who should be notified first. The immediate circle usually includes a spouse or partner, children, parents, siblings, and one practical helper who can keep a list of tasks. When everyone knows who is calling whom, duplicate conversations and painful surprises are reduced.",
          "If the death occurred in a hospital, hospice, or care facility, ask the staff for the exact next steps before leaving. They can usually explain what documents will be issued, when the body will be released, and which contact person will guide the family through the transfer process.",
        ],
      },
      {
        heading: "Pause large decisions until the household can think clearly",
        paragraphs: [
          "Families often feel pressure to choose burial, cremation, a service date, a venue, and an obituary all at once. When possible, hold the major financial or ceremonial decisions until at least one trusted relative has reviewed the options. A short delay can prevent choices that later feel hurried or incomplete.",
          "Write down the decisions that must be made immediately and divide them into categories: legal, logistical, ceremonial, and personal. That simple sorting exercise helps the family focus on what is urgent and what can wait until the shock has softened.",
        ],
      },
      {
        heading: "Protect the home and the most important records",
        paragraphs: [
          "If the deceased lived alone, make sure the residence is secure and that medications, valuables, and key documents are gathered in one place. Search for identification, insurance paperwork, military discharge records, and any prearranged funeral instructions.",
          "Create one folder or envelope for every original document. Keep a written note of who has each item, because grief makes small details easy to forget. One page of careful notes can save hours later when the family begins handling estate matters.",
        ],
      },
      {
        heading:
          "Ask for support instead of trying to carry everything privately",
        paragraphs: [
          "Many families try to stay strong by staying silent. In practice, the first day is easier when one person asks for meals, another answers messages, and someone else manages transportation. Grief feels less overwhelming when the practical burden is shared.",
          "The most compassionate first 24 hours are not perfect; they are organized enough for people to rest, remember, and begin the next step with clarity.",
        ],
      },
    ],
  },
  {
    id: "why-funerals-matter",
    label: "Grief Support",
    title: "Why funerals help families begin grieving",
    summary:
      "A funeral creates structure, acknowledgement, and communal care at a time when grief can otherwise feel invisible and isolating.",
    image: "/Source/person.jpg",
    intro:
      "Funerals are not only about ceremony. They give grief a place to be seen, spoken, and carried by more than one person. In the absence of a service, death can feel unfinished or unreal. A well-shaped funeral service allows the family to recognize the loss together and begin the harder work of living with it.",
    sections: [
      {
        heading: "A service makes the loss real in a gentle way",
        paragraphs: [
          "When family and friends gather, the death moves from private knowledge to shared reality. That change matters because grief often arrives in waves of disbelief. Hearing the name, seeing the photographs, and listening to memories can help the mind accept what the heart already knows.",
          "A funeral does not end grief. It gives grief a first container, a setting where sadness, gratitude, and silence can exist without explanation.",
        ],
      },
      {
        heading: "It gives everyone a role",
        paragraphs: [
          "Without a service, mourners often ask how they can help and receive no clear answer. A funeral naturally creates roles: greeting guests, reading a tribute, preparing flowers, carrying photos, sharing food, or simply sitting with the family. These small responsibilities turn sympathy into action.",
          "That sense of participation matters. People heal more easily when they know they contributed something meaningful, even if the contribution was simply their presence.",
        ],
      },
      {
        heading: "It preserves identity and story",
        paragraphs: [
          "A funeral is one of the few moments when a whole life can be described aloud in the same room. The service can hold the person's humor, habits, values, and impact. It can include music, readings, and stories that show the deceased as a human being rather than as a medical event or legal case.",
          "Families often later remember the service as the moment they understood the full shape of the life they lost. That memory becomes part of the family story itself.",
        ],
      },
      {
        heading: "It offers a first step toward community care",
        paragraphs: [
          "A funeral is also practical. It is the time when meals are organized, travel plans are made, and future support starts to form. Many long-term acts of care begin with a service because people can see the family's needs more clearly.",
          "For that reason, a funeral is not just a goodbye. It is the first shared act of remembrance and the start of a wider support network.",
        ],
      },
    ],
  },
  {
    id: "burial-or-cremation",
    label: "Choices",
    title: "How do I choose between burial and cremation?",
    summary:
      "A grounded look at values, cost, religious tradition, and family preference so the decision feels thoughtful rather than rushed.",
    image: "/Source/Card_Image.jpg",
    intro:
      "The burial-or-cremation decision is rarely about a single factor. It usually sits at the intersection of personal beliefs, family customs, budget, geography, and the kind of remembrance the family wants to create. The right choice is the one that fits the deceased's wishes and the family's practical reality.",
    sections: [
      {
        heading: "Start with any known wishes",
        paragraphs: [
          "If the deceased left written instructions, a prearranged plan, or repeated verbal guidance, begin there. Many conflicts can be avoided by honoring a choice that was made while the person was able to speak for themselves. Even a simple note can be enough to shape the decision.",
          "If the person never expressed a preference, ask whether their life reflected a strong tradition or belief that may still guide the family.",
        ],
      },
      {
        heading: "Compare the practical differences honestly",
        paragraphs: [
          "Burial often requires a cemetery plot, casket, vault, and grave opening fees. Cremation usually reduces some of those costs but may still involve a memorial service, urn, or final placement ceremony. The financial difference matters, but it should be understood clearly rather than guessed.",
          "Families should also think about timing. Burial may require more immediate decisions, while cremation can offer more flexibility if relatives need time to travel or gather.",
        ],
      },
      {
        heading: "Consider the long view",
        paragraphs: [
          "Ask how the family wants to visit, remember, and speak about the person in the years ahead. Some families find comfort in a known gravesite. Others prefer a cremation that allows ashes to be kept, scattered, or placed in a meaningful location.",
          "Neither choice is emotionally superior. The best outcome is the one that leaves the family with a durable and respectful way to remember.",
        ],
      },
      {
        heading: "Choose the option that can be carried with peace",
        paragraphs: [
          "If the family can explain the decision to each other with calm and confidence, the decision is probably the right one. When the reasoning feels inconsistent or defensive, it may be worth pausing and revisiting the deceased's values one more time.",
          "The goal is not to avoid grief. The goal is to make a decision that the family can live with tenderly after the service ends.",
        ],
      },
    ],
  },
  {
    id: "personal-eulogy",
    label: "Tributes",
    title: "How do I write a eulogy that feels personal?",
    summary:
      "A eulogy becomes memorable when it sounds like the person, not like a formal template, and when it balances honesty with warmth.",
    image: "/Source/Banner.jpg",
    intro:
      "The most moving eulogies rarely try to sound perfect. They sound specific. They use details that only friends and family would know, they acknowledge both joy and loss, and they help the room remember the person as someone fully known. A personal eulogy does not need to cover everything; it needs to capture something true.",
    sections: [
      {
        heading: "Begin with one true memory",
        paragraphs: [
          "A single moment can establish the tone of the whole tribute. You might describe a habit, a phrase the person repeated, a way they laughed, or a small kindness they offered regularly. That detail gives the audience an immediate sense of presence.",
          "From there, move into what that memory reveals about the person's character. Was it generosity, humor, discipline, or patience? The memory becomes meaningful when it points to a larger truth.",
        ],
      },
      {
        heading: "Balance honesty with care",
        paragraphs: [
          "A good eulogy does not pretend life was simple. It can acknowledge struggle, distance, illness, or unfinished conversations while still making room for love. Families often connect more deeply when the tribute feels human rather than polished beyond recognition.",
          "Use gentle language and avoid detailing anything that would embarrass the family. The goal is candor with dignity, not confession for its own sake.",
        ],
      },
      {
        heading: "Structure the tribute so it can be heard easily",
        paragraphs: [
          "Three parts usually work well: a brief introduction, several specific stories or qualities, and a closing message of thanks or farewell. Repetition is helpful when the room is emotional, because listeners may only absorb parts of the speech at a time.",
          "Read the draft out loud. If a sentence sounds like something you would never actually say, simplify it. Spoken language works best when it sounds natural in the mouth.",
        ],
      },
      {
        heading: "End with something that lasts",
        paragraphs: [
          "Close with a sentence that people can carry with them. It may be a blessing, a final thank you, or a line that reflects the way the person made others feel. The ending should feel like a handoff from memory to legacy.",
          "A personal eulogy succeeds when listeners leave the service feeling that they met the person again, even if only for a few minutes.",
        ],
      },
    ],
  },
];

const rowTwoArticles: FuneralAdviceArticle[] = [
  {
    id: "support-children",
    label: "Family Care",
    title: "How can I support children after a death?",
    summary:
      "Children need truth, routine, and reassurance presented in language that matches their age and emotional maturity.",
    image: "/Source/person.jpg",
    intro:
      "Children grieve differently from adults. They move between tears, questions, play, and silence in a way that can confuse caregivers who are already overwhelmed. The most important thing is not to protect children from the truth, but to tell them the truth in a steady, age-appropriate way.",
    sections: [
      {
        heading: "Use clear words rather than euphemisms",
        paragraphs: [
          "Children usually do better when adults say that someone died instead of saying they were lost or went to sleep. Soft language can create fear or misunderstanding. Simple language helps a child understand that death is final and that the adults around them are telling the truth.",
          "After the first explanation, answer questions honestly and briefly. A child may need the same answer many times before it feels secure.",
        ],
      },
      {
        heading: "Keep routines steady where you can",
        paragraphs: [
          "Predictable meals, school drop-offs, bedtime rituals, and familiar objects can help children feel safe when the rest of life feels unstable. A routine does not remove grief, but it gives the child a dependable structure inside the loss.",
          "If a normal routine must change, explain the change before it happens so the child is not surprised by another unknown.",
        ],
      },
      {
        heading: "Let children remember in their own way",
        paragraphs: [
          "Some children want to draw, some want to ask questions, and some want to play while talking about the person they lost. All of those responses are normal. Grief is often expressed indirectly, especially in younger children who do not yet have enough words for their feelings.",
          "Give them a way to participate in the memorial if they wish, such as placing a flower, choosing a photo, or helping make a memory box.",
        ],
      },
      {
        heading: "Watch for silence that looks like coping",
        paragraphs: [
          "A child who seems perfectly fine may still be processing the loss internally. Look for changes in sleep, appetite, school behavior, or separation anxiety. If those shifts persist, extra support from a counselor or pediatric grief specialist can help.",
          "The long-term message children need is simple: they can talk about the loss, and the adults in their lives will stay present.",
        ],
      },
    ],
  },
  {
    id: "graveside-service",
    label: "Ceremony",
    title: "What is a graveside service and when is it chosen?",
    summary:
      "A graveside service is an intimate gathering held at the burial site, often chosen when families want a simple, focused farewell.",
    image: "/Source/Banner.jpg",
    intro:
      "A graveside service places the act of farewell at the burial site itself. For many families, that setting offers a direct and quiet way to mark the final placement of the body or urn. It can stand alone or follow a larger memorial service.",
    sections: [
      {
        heading: "Why families choose it",
        paragraphs: [
          "Some families prefer a graveside service because it is intimate, efficient, and deeply symbolic. The surrounding cemetery or resting place can create a sense of finality that many mourners find comforting. It also reduces the need for a second formal gathering when travel is difficult.",
          "Other families choose it because the deceased preferred simplicity. In that case, the service can be brief without feeling incomplete.",
        ],
      },
      {
        heading: "What the service usually includes",
        paragraphs: [
          "A graveside service might include a prayer, a reading, a few words from the officiant, and a closing tribute from family. It is often shorter than a chapel service and can feel quieter and more personal. The pace tends to be gentle because the surrounding space already carries emotional weight.",
          "Music, flowers, and small symbolic gestures can make the moment feel personal without making it elaborate.",
        ],
      },
      {
        heading: "When it may be the best option",
        paragraphs: [
          "A graveside service can be helpful when the family wants a direct burial ritual, when the deceased had clear religious or cultural traditions tied to burial, or when the gathering needs to stay modest because of health, time, or budget constraints.",
          "It can also work well as the final moment after a separate memorial event, allowing the family to have both remembrance and committal.",
        ],
      },
      {
        heading: "What matters most",
        paragraphs: [
          "The setting is important, but the tone is more important. A graveside service feels meaningful when the family is given room to stand still, speak honestly, and say goodbye without being hurried. The simplicity should feel intentional, not empty.",
          "That is what makes it powerful: its quietness leaves space for love to be heard.",
        ],
      },
    ],
  },
  {
    id: "logistics-help",
    label: "Practical Help",
    title: "How do I help with food and logistics after a loss?",
    summary:
      "Practical help is one of the most useful forms of care because it reduces the invisible load on a grieving household.",
    image: "/Source/Card_Image.jpg",
    intro:
      "When a family is grieving, the simplest gifts are often the most useful. Food, transportation, child care, errands, and quiet organization can all make the first weeks easier. Good support is specific, respectful, and easy to accept.",
    sections: [
      {
        heading: "Offer concrete help rather than open-ended help",
        paragraphs: [
          "Instead of asking, 'What can I do?', offer a meal on a particular day, a ride to the airport, or help picking up groceries. Grieving families rarely have energy to assign tasks, so specific offers are easier to receive.",
          "If you are coordinating with others, create a shared list so that food does not arrive in duplicate while another need is overlooked.",
        ],
      },
      {
        heading: "Think about the type of food and the timing",
        paragraphs: [
          "Simple, familiar meals usually work best. Choose food that reheats well and can be eaten at different times, because families often eat when they can rather than when they should. Include clear labels for ingredients if the household has allergies or dietary restrictions.",
          "Drop the food off in a way that does not require hosting or conversation. Respecting the family's energy is part of the kindness.",
        ],
      },
      {
        heading: "Help with the tasks people forget to mention",
        paragraphs: [
          "A grieving home often needs trash taken out, laundry started, pets fed, school forms signed, and messages answered. These tasks are easy to overlook because none of them sound urgent individually. Together, they can become overwhelming.",
          "When possible, take initiative on one practical task and finish it fully rather than leaving the family to supervise the work.",
        ],
      },
      {
        heading: "Leave room for privacy",
        paragraphs: [
          "Support should not become an obligation to entertain guests or explain emotions. Sometimes the best practical help is quiet, reliable, and brief. You can deliver the meal, refill the water, and leave without asking for a performance of gratitude.",
          "That kind of support feels safe, and safe support is the kind families remember most.",
        ],
      },
    ],
  },
  {
    id: "annual-remembrance",
    label: "Legacy",
    title: "Should we plan an annual remembrance ritual?",
    summary:
      "A yearly ritual can help families stay connected to a loved one's story without feeling trapped in grief.",
    image: "/Source/person.jpg",
    intro:
      "A remembrance ritual gives grief a rhythm. It can be as formal as a candle lighting or as simple as sharing the person's favorite meal on the anniversary of their death. The best ritual is one that the family can sustain naturally over time.",
    sections: [
      {
        heading: "Choose a ritual that can be repeated",
        paragraphs: [
          "A yearly tradition is only helpful if it is realistic. Families often do better with something modest that can be maintained every year than with a grand plan that becomes difficult to repeat. Consistency matters more than scale.",
          "A short visit, a meal, a prayer, a donation, or a memory walk can all serve as stable rituals.",
        ],
      },
      {
        heading: "Invite people without making attendance feel compulsory",
        paragraphs: [
          "Some relatives will want a large gathering while others will want quiet. It helps to define the ritual clearly and allow participation in different forms. Not everyone has to attend physically to honor the day.",
          "This flexibility lets the ritual remain warm rather than burdensome.",
        ],
      },
      {
        heading: "Tie the ritual to a meaningful action",
        paragraphs: [
          "The most memorable annual rituals usually include an action connected to the person's life: cooking a favorite recipe, visiting a place they loved, listening to a song they played often, or supporting a cause they cared about.",
          "Action helps remembrance become embodied. It gives the family something to do with love instead of only something to say about it.",
        ],
      },
      {
        heading: "Let the ritual evolve",
        paragraphs: [
          "A ritual may begin as a candle and later become a family meal, or start as a meal and later become a donation tradition. That evolution is normal. The point is not to freeze the memory in time but to create a living form of remembrance.",
          "If the ritual still feels honest after several years, it is doing its work well.",
        ],
      },
    ],
  },
  {
    id: "annual-remembrance",
    label: "Legacy",
    title: "Should we plan an annual remembrance ritual?",
    summary:
      "A yearly ritual can help families stay connected to a loved one's story without feeling trapped in grief.",
    image: "/Source/person.jpg",
    intro:
      "A remembrance ritual gives grief a rhythm. It can be as formal as a candle lighting or as simple as sharing the person's favorite meal on the anniversary of their death. The best ritual is one that the family can sustain naturally over time.",
    sections: [
      {
        heading: "Choose a ritual that can be repeated",
        paragraphs: [
          "A yearly tradition is only helpful if it is realistic. Families often do better with something modest that can be maintained every year than with a grand plan that becomes difficult to repeat. Consistency matters more than scale.",
          "A short visit, a meal, a prayer, a donation, or a memory walk can all serve as stable rituals.",
        ],
      },
      {
        heading: "Invite people without making attendance feel compulsory",
        paragraphs: [
          "Some relatives will want a large gathering while others will want quiet. It helps to define the ritual clearly and allow participation in different forms. Not everyone has to attend physically to honor the day.",
          "This flexibility lets the ritual remain warm rather than burdensome.",
        ],
      },
      {
        heading: "Tie the ritual to a meaningful action",
        paragraphs: [
          "The most memorable annual rituals usually include an action connected to the person's life: cooking a favorite recipe, visiting a place they loved, listening to a song they played often, or supporting a cause they cared about.",
          "Action helps remembrance become embodied. It gives the family something to do with love instead of only something to say about it.",
        ],
      },
      {
        heading: "Let the ritual evolve",
        paragraphs: [
          "A ritual may begin as a candle and later become a family meal, or start as a meal and later become a donation tradition. That evolution is normal. The point is not to freeze the memory in time but to create a living form of remembrance.",
          "If the ritual still feels honest after several years, it is doing its work well.",
        ],
      },
    ],
  },
  {
    id: "annual-remembrance",
    label: "Legacy",
    title: "Should we plan an annual remembrance ritual?",
    summary:
      "A yearly ritual can help families stay connected to a loved one's story without feeling trapped in grief.",
    image: "/Source/person.jpg",
    intro:
      "A remembrance ritual gives grief a rhythm. It can be as formal as a candle lighting or as simple as sharing the person's favorite meal on the anniversary of their death. The best ritual is one that the family can sustain naturally over time.",
    sections: [
      {
        heading: "Choose a ritual that can be repeated",
        paragraphs: [
          "A yearly tradition is only helpful if it is realistic. Families often do better with something modest that can be maintained every year than with a grand plan that becomes difficult to repeat. Consistency matters more than scale.",
          "A short visit, a meal, a prayer, a donation, or a memory walk can all serve as stable rituals.",
        ],
      },
      {
        heading: "Invite people without making attendance feel compulsory",
        paragraphs: [
          "Some relatives will want a large gathering while others will want quiet. It helps to define the ritual clearly and allow participation in different forms. Not everyone has to attend physically to honor the day.",
          "This flexibility lets the ritual remain warm rather than burdensome.",
        ],
      },
      {
        heading: "Tie the ritual to a meaningful action",
        paragraphs: [
          "The most memorable annual rituals usually include an action connected to the person's life: cooking a favorite recipe, visiting a place they loved, listening to a song they played often, or supporting a cause they cared about.",
          "Action helps remembrance become embodied. It gives the family something to do with love instead of only something to say about it.",
        ],
      },
      {
        heading: "Let the ritual evolve",
        paragraphs: [
          "A ritual may begin as a candle and later become a family meal, or start as a meal and later become a donation tradition. That evolution is normal. The point is not to freeze the memory in time but to create a living form of remembrance.",
          "If the ritual still feels honest after several years, it is doing its work well.",
        ],
      },
    ],
  },
];

const rowOneArticlesAdditional: FuneralAdviceArticle[] = [
  {
    id: "service-music",
    label: "Ceremony",
    title: "How do I choose music for a memorial service?",
    summary:
      "The right music feels faithful to the person, supports the tone of the service, and helps guests move through the ceremony with grace.",
    image: "/Source/person.jpg",
    intro:
      "Music is one of the most emotionally direct parts of a funeral or memorial service. It can soften an entrance, frame a reading, or close a ceremony with a feeling that words alone cannot create. The most effective choices are usually not the most dramatic; they are the ones that sound like the person being remembered.",
    sections: [
      {
        heading: "Start with meaning, not with genre",
        paragraphs: [
          "Think first about what the person loved, what they listened to often, and what sounds marked important moments in their life. A hymn, a favorite classical piece, a jazz standard, or a song from a family road trip can be equally appropriate if it feels authentic.",
          "The music should not only be beautiful. It should feel like it belongs to the person and the room.",
        ],
      },
      {
        heading: "Balance familiarity with atmosphere",
        paragraphs: [
          "Some services benefit from one familiar song that most guests know and one personal choice that reflects the deceased more specifically. That balance helps the room feel included while still honoring the person in a distinctive way.",
          "If the service is very formal, quieter instrumental music can be more effective than a lyric-driven track that may draw attention away from the readings.",
        ],
      },
      {
        heading: "Match the music to the part of the service",
        paragraphs: [
          "Entrance music, reflection music, and closing music do not need to carry the same emotional tone. A service can begin gently, deepen during the remembrance, and end with a melody that offers release or hope.",
          "That progression helps mourners experience the service as a complete arc rather than as separate moments placed beside each other.",
        ],
      },
      {
        heading: "Keep the volume and transitions simple",
        paragraphs: [
          "The best musical choices can still be weakened by awkward volume levels or abrupt transitions. Ask the person coordinating the service to test playback in the room beforehand if possible, and choose versions that fade naturally or start cleanly.",
          "A thoughtful musical plan should support the memory, not compete with it.",
        ],
      },
    ],
  },
];

const rowTwoArticlesAdditional: FuneralAdviceArticle[] = [
  {
    id: "talking-to-teens",
    label: "Family Care",
    title: "How should I talk to teenagers about death?",
    summary:
      "Teenagers usually want honesty, room to react in their own way, and adults who will not over-explain or avoid hard questions.",
    image: "/Source/Banner.jpg",
    intro:
      "Teenagers often experience grief with a mix of independence and vulnerability. They may want to seem composed while feeling deeply unsettled. The most helpful response is calm honesty paired with respect for their privacy and emotional pace.",
    sections: [
      {
        heading: "Be direct without being clinical",
        paragraphs: [
          "Teenagers typically appreciate being treated like people who can handle the truth. Use clear language and avoid pretending that everything will feel normal immediately. You do not need to force a speech; you need to offer a steady place for conversation.",
          "If they ask a question you cannot answer, say so plainly instead of inventing certainty.",
        ],
      },
      {
        heading: "Respect their need for distance and connection",
        paragraphs: [
          "Some teenagers will want to talk immediately, while others will process quietly and return later with questions. Both responses are normal. Give them time to step in and out of the conversation without making them feel judged.",
          "A teenager often feels safer when they know support is available even when they are not ready to ask for it.",
        ],
      },
      {
        heading: "Let them participate in ways that feel genuine",
        paragraphs: [
          "They may want to attend the service, help with photos, choose music, or write a note. Participation can be meaningful without being performative. Let the teenager decide how visible they want to be.",
          "Control over the size of their involvement can make grief feel less overwhelming.",
        ],
      },
      {
        heading: "Watch for delayed grief",
        paragraphs: [
          "Teenagers sometimes look fine during the first few days and struggle later, once the room quiets down. Keep an eye on sleep, school focus, appetite, irritability, and isolation. Gentle follow-up matters more than a single big talk.",
          "Consistency from adults is what makes the difference over time.",
        ],
      },
    ],
  },
  {
    id: "thank-you-notes",
    label: "Practical Help",
    title: "When should we send thank-you notes after a funeral?",
    summary:
      "Thank-you notes should be timely enough to feel sincere, but not so immediate that they add pressure during the busiest days of grief.",
    image: "/Source/Card_Image.jpg",
    intro:
      "Families often worry that thank-you notes need to be completed immediately after a funeral. In reality, gratitude can be expressed once the family has enough emotional space to do it thoughtfully. A slower, genuine note is better than a rushed one.",
    sections: [
      {
        heading: "Wait until the household is steady enough to write",
        paragraphs: [
          "There is no perfect day, but it usually helps to wait until the service, travel, and urgent paperwork have passed. That gives the family a chance to write with care rather than out of obligation.",
          "If several people are helping, divide the list so the work is manageable.",
        ],
      },
      {
        heading: "Keep the message specific and short",
        paragraphs: [
          "A thank-you note is strongest when it mentions the exact kindness received. That could be a meal, a contribution, attendance at the service, or a helpful gesture in the days after the loss. Specificity makes gratitude feel real.",
          "A few sincere sentences are enough. The note does not need to be lengthy to be meaningful.",
        ],
      },
      {
        heading: "Use help when the list is large",
        paragraphs: [
          "When many gifts and gestures need acknowledgment, it is reasonable to ask a close relative or friend to help keep track of names and addresses. The point is to preserve gratitude, not to turn the process into another burden.",
          "If the family is overwhelmed, a delayed but thoughtful note still communicates care.",
        ],
      },
      {
        heading: "Do not let perfection delay appreciation",
        paragraphs: [
          "Handwritten notes have emotional warmth, but they do not need to be flawless. A simple message delivered with sincerity is enough. The people who supported the family usually understand that grief changes the pace of everything.",
          "What matters is that the thanks are genuine and eventually expressed.",
        ],
      },
    ],
  },
];

const rowOneSponsoredCards: SponsoredCard[] = [
  {
    label: "Sponsored Story",
    title: "Celebrate a life beautifully.",
    description:
      "Showcase a memorial with a dedicated banner, preserved memories, and a timeless presentation that feels personal on every device.",
    image: "/Source/Card_Image.jpg",
  },
  {
    label: "Planning Partner",
    title: "Bring clarity to every memorial decision.",
    description:
      "Offer families a calm path for service planning, obituary writing, and remembrance details that remain meaningful for years.",
    image: "/Source/Banner.jpg",
  },
];

const rowTwoSponsoredCards: SponsoredCard[] = [
  {
    label: "Support Network",
    title: "Create a memorial that feels lived-in.",
    description:
      "Pair warm photography with a thoughtful structure so every tribute feels steady, intimate, and easy to revisit later.",
    image: "/Source/person.jpg",
  },
  {
    label: "Sponsored Story",
    title: "Keep family memories in one calm place.",
    description:
      "Organize tributes, photos, and condolences inside a design that stays elegant, readable, and comforting across devices.",
    image: "/Source/Card_Image.jpg",
  },
];

// Static testimonial/review data used on the homepage
const testimonials = [
  {
    id: "testi-1",
    quote:
      "I liked being able to do everything online and cross-post to my local newspaper.",
    author: "Nicole O'Brion",
  },
  {
    id: "testi-2",
    quote:
      "Creating a memorial was simple — the site helped our family keep memories and photos in one place.",
    author: "Marcus Lee",
  },
  {
    id: "testi-3",
    quote:
      "Support was compassionate and the tools were easy to use during a difficult time.",
    author: "Aisha Khan",
  },
];

export {
  rowOneArticles,
  rowTwoArticles,
  rowOneArticlesAdditional,
  rowTwoArticlesAdditional,
  rowOneSponsoredCards,
  rowTwoSponsoredCards,
  testimonials,
};
