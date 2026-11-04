/** Short design experiments shown on /sandbox: a brief next to a prototype that plays the flow. */
export interface SandboxStudy {
  slug: string;
  domain: string;
  name: string;
  /** Prototype file in src/sandbox/prototypes. */
  file: string;
  /** Accent sampled from the prototype, used for the small marker dot. */
  accent: string;
  headline: string;
  pain: string;
  business: string;
  decisions: [string, string, string];
  flow: string[];
  measure: string[];
}

export const sandbox: SandboxStudy[] = [
  {
    slug: "tab",
    domain: "Fintech",
    name: "Tab",
    file: "tab.dc.html",
    accent: "#3A3FD8",
    headline: "Split a restaurant bill without the math.",
    pain: "When one person pays for the group, they spend days chasing everyone with screenshots and rough math. Splitting evenly feels unfair, and splitting by item means pulling out a calculator at the table.",
    business: "Every split sends payment requests to friends. That brings new people into the app and increases the number of payments it handles.",
    decisions: [
      "You pick a person, then tap what they ordered. If two people tap the same item, it gets shared.",
      "Tax and tip are split based on what each person ordered.",
      "Everyone's total updates as you go, so there are no surprises at the end.",
    ],
    flow: ["Scan", "Assign", "Review", "Request"],
    measure: ["Time from scan to sent requests", "How often people split by item vs. evenly", "How many invited friends sign up"],
  },
  {
    slug: "aloft",
    domain: "Travel",
    name: "Aloft",
    file: "aloft.dc.html",
    accent: "#0A5BC4",
    headline: "Rebook a missed connection from your phone.",
    pain: "When a flight is delayed, people wait in line at the desk or on hold while seats on other flights fill up. It's hard to see the options and when each one gets them there.",
    business: "Letting travelers rebook on their own takes pressure off agents during delays, when call volume is highest. It also makes a bad travel day a little easier.",
    decisions: [
      "The alert tells you that you'll miss your connection, instead of only showing a new departure time.",
      "Options are compared by arrival time, since that's what travelers care about most.",
      "Seats on the best options are held for a while, so people can decide without rushing.",
    ],
    flow: ["Alert", "Compare", "Confirm", "Board"],
    measure: ["Share of travelers who rebook on their own", "Agent contacts per delayed traveler", "Time from alert to new boarding pass"],
  },
  {
    slug: "dose",
    domain: "Healthcare",
    name: "Dose",
    file: "dose.dc.html",
    accent: "#0B6E62",
    headline: "Refill a prescription in three taps.",
    pain: "People often realize they're out of medication on the last day. Then they deal with phone menus, unclear pickup times and surprise costs at the counter.",
    business: 'Refilling on time helps people stay on their medication and keeps their prescriptions at the same pharmacy. Fewer "is it ready?" calls give staff more time for patients.',
    decisions: [
      "The reminder shows how many days of medication are left, which is easier to act on than a date.",
      "Pharmacy, insurance and copay are already filled in. The user just confirms.",
      "The order status updates until pickup, so there's no need to call.",
    ],
    flow: ["Nudge", "Confirm", "Track", "Pick up"],
    measure: ["Refills requested before running out", "Status calls per refill", "Prescriptions never picked up"],
  },
  {
    slug: "field-co",
    domain: "Retail",
    name: "Field & Co.",
    file: "field-co.dc.html",
    accent: "#A13A0B",
    headline: "A one-page mobile checkout.",
    pain: "Long mobile checkouts make people retype details the store already has, and the shipping cost often shows up only at the last step.",
    business: "Each extra step loses some shoppers. A shorter checkout with costs shown early converts better, and showing delivery as dates gets more people to pay for faster shipping.",
    decisions: [
      "Everything is on one page and already filled in. Changes are made right there.",
      'Delivery options are shown as arrival dates, like "Tomorrow by 8 PM".',
      "The total updates as soon as an option changes, so the final price is never a surprise.",
    ],
    flow: ["Bag", "Checkout", "Pay", "Confirmed"],
    measure: ["Bag-to-order conversion", "Drop-off at delivery selection", "How often people choose faster delivery"],
  },
  {
    slug: "forkful",
    domain: "Food delivery",
    name: "Forkful",
    file: "forkful.dc.html",
    accent: "#B4232F",
    headline: "Fix a wrong order in under a minute.",
    pain: "Something is missing from your order, you're hungry, and getting it fixed means a long support chat where you have to explain what went wrong.",
    business: "A bad order is a common reason people stop using a delivery app. A quick fix keeps them ordering, cuts support tickets and gives restaurants useful feedback.",
    decisions: [
      "You report the problem from the receipt by tapping the item and picking what happened.",
      "The customer chooses the fix: a refund now, or the item delivered again in about 25 minutes.",
      "A small credit is added automatically to say sorry.",
    ],
    flow: ["Orders", "Report item", "Choose a fix", "Resolved"],
    measure: ["Time to resolve an issue", "Support contacts per issue", "Reorders within 14 days of an issue"],
  },
  {
    slug: "hearth",
    domain: "Smart home",
    name: "Hearth",
    file: "hearth.dc.html",
    accent: "#A04B05",
    headline: "Catch energy spikes while you can still act.",
    pain: "Most energy apps show charts people rarely look at. A costly spike usually shows up on the bill weeks later, when it's too late to change anything.",
    business: "Moving usage away from peak hours lowers costs and can qualify the company for utility programs. Seeing real savings keeps people coming back to the app.",
    decisions: [
      "Alerts explain the extra cost in dollars and what's causing it, like the dryer and AC running together.",
      "One suggested action with a simple cost comparison, scheduled in one tap.",
      "A weekly summary shows how much people have saved, which helps the habit stick.",
    ],
    flow: ["Spike alert", "Suggested action", "Savings summary"],
    measure: ["How often people accept a suggestion", "Share of usage moved off peak", "Weekly visits to the savings screen"],
  },
  {
    slug: "thread",
    domain: "E-commerce",
    name: "Thread",
    file: "thread.dc.html",
    accent: "#7A2E5C",
    headline: "Find the right size in 30 seconds.",
    pain: "Size charts ask for measurements most people don't know. So shoppers order two sizes and return one, or don't buy at all.",
    business: "Poor fit is one of the main reasons clothes get returned, and returns are expensive. Helping people pick the right size the first time increases sales and lowers shipping costs.",
    decisions: [
      "The questions are about how clothes usually fit you, so you don't need a tape measure.",
      "Three questions with one tap each. The quiz moves to the next one on its own.",
      "The result explains why the size fits and how the sizes above and below would feel.",
    ],
    flow: ["Product", "3-question quiz", "Your size", "Add to bag"],
    measure: ["Returns because of fit", "Quiz completion rate", "Sales from quiz users compared to size chart users"],
  },
  {
    slug: "ferry",
    domain: "Fintech onboarding",
    name: "Ferry",
    file: "ferry.dc.html",
    accent: "#2D4FA3",
    headline: "Ready to send money in under two minutes.",
    pain: "Money transfer apps ask for passwords, addresses and ID photos before showing an exchange rate. Many people quit before finding out if the app is worth using.",
    business: "Losing people during sign-up is expensive, since many of them came from paid ads. Showing the rate early and asking for less gets more people to finish signing up.",
    decisions: [
      "The live exchange rate is on the first screen, before any sign-up.",
      "Three short intro slides about speed, fees and safety. Each one can be skipped.",
      "Sign-up only needs a phone number, and the code fills in by itself. The ID check happens later, before the first transfer.",
    ],
    flow: ["Landing", "Onboarding", "Phone", "Verify", "Ready"],
    measure: ["Installs that become accounts", "Drop-off at each onboarding step", "Time to first transfer"],
  },
  {
    slug: "ember",
    domain: "Food ordering",
    name: "Ember",
    file: "ember.dc.html",
    accent: "#C2410C",
    headline: "Order food and choose how it arrives, all in one flow.",
    pain: "Delivery instructions usually go in a notes field that couriers often miss. Typing card details on a phone is also where a lot of checkout mistakes happen.",
    business: "Fewer failed deliveries and payment errors mean fewer refunds and support calls. Clear delivery options also help the business send each order the most efficient way.",
    decisions: [
      "No-contact delivery is a simple toggle, and you get a photo when the order is dropped off.",
      "Pickup, courier and drone are listed together, each with its time and price.",
      "The card on screen fills in as you type and flips over when you enter the CVC.",
    ],
    flow: ["No-contact", "Product", "Checkout", "Card", "Tracking"],
    measure: ["Checkout completion", "Card entry errors", "Failed no-contact deliveries"],
  },
  {
    slug: "cinepass",
    domain: "Entertainment",
    name: "cinePass",
    file: "cinepass.dc.html",
    accent: "#4338CA",
    headline: "Book movie tickets nearby in five taps.",
    pain: "Moviegoers jump between theater apps, maps and seat charts. Showtimes, seats and prices are in different places, and the total only shows at the end.",
    business: "One app for all nearby theaters makes it easy to book on a whim. Paying with a cinePass membership earns points, which brings people back.",
    decisions: [
      "The map and the theater list are linked. Tapping a pin or a row highlights the same theater in both.",
      "All nearby showtimes are on one screen. Sold-out times are still shown, but grayed out.",
      "The seat map shows a running total, and tickets are saved to your cinePass.",
    ],
    flow: ["Theater", "Showtime", "Seats", "Booked"],
    measure: ["Time from opening the app to booking", "Drop-off at seat selection", "Bookings paid with cinePass"],
  },
  {
    slug: "haven",
    domain: "Home goods",
    name: "Haven",
    file: "haven.dc.html",
    accent: "#8A5A0B",
    headline: "Buy furniture online with more confidence.",
    pain: "Buying furniture online is a guess. People wonder if the color will match their room or if it will fit by the window, so big items sit in carts for weeks.",
    business: "Returning large furniture is very expensive. Seeing a piece in your own room helps people buy with confidence and return less, and one good add-on suggestion raises the order total.",
    decisions: [
      "The product fills the screen, and the color swatches change it instantly.",
      '"View in your room" shows the chair at real size, and you can drag it around.',
      "The bag suggests one item that goes well with the order.",
    ],
    flow: ["Trending", "Product", "In your room", "Bag", "Ordered"],
    measure: ["Add-to-cart rate with and without room view", "Returns for items viewed in a room", "How often the suggested item is added"],
  },
];
