const classList = [
  // {
  //   label: "All Classes",
  //   value: "",
  // },
  // {
  //   label: "Anubhuti Class (EA)",
  //   value: "EA",
  // },
  {
    label: "AC First Class (1A) ",
    value: "1A",
  },
  {
    label: "Vistadome AC (EV)",
    value: "EV",
  },
  {
    label: "Exec. Chair Car (EC)",
    value: "EC",
  },
  {
    label: "AC 2 Tier (2A)",
    value: "2A",
  },
  // {
  //   label: "First Class (FC)",
  //   value: "FC",
  // },
  {
    label: "AC 3 Tier (3A)",
    value: "3A",
  },
  {
    label: "AC 3 Economy (3E)",
    value: "3E",
  },
  // {
  //   label: "Vistadome Chair Car (VC)",
  //   value: "VC",
  // },
  {
    label: "AC Chair car (CC)",
    value: "CC",
  },
  {
    label: "Sleeper (SL)",
    value: "SL",
  },
  // {
  //   label: "Vistadome Non AC (VS)",
  //   value: "VS",
  // },
  {
    label: "Second Sitting (2S)",
    value: "2S",
  },
];

const quotaList = [
  {
    label: "GENERAL",
    value: "GN",
  },
  {
    label: "LADIES",
    value: "LD",
  },
  {
    label: "LOWER BERTH/SR.CITIZEN",
    value: "SS",
  },
  {
    label: "PERSON WITH DISABILITY",
    value: "HP",
  },
  {
    label: "TATKAL",
    value: "TQ",
  },
  {
    label: "PREMIUM TATKAL",
    value: "PT",
  },
];

const passengerGenderList = [
  {
    label: "Male",
    value: "M",
  },
  {
    label: "Female",
    value: "F",
  },
  {
    label: "Transgender",
    value: "T",
  },
];
const infantGenderList = [
  {
    label: "Male",
    value: "M",
  },
  {
    label: "Female",
    value: "F",
  },
  {
    label: "Transgender",
    value: "T",
  },
];

const infantAge = [
  {
    label: "Below one year",
    value: 0,
  },
  {
    label: "One year",
    value: 1,
  },
  {
    label: "Two years",
    value: 2,
  },
  {
    label: "Three years",
    value: 3,
  },
  {
    label: "Four years",
    value: 4,
  },
];

const berthChoiceList = {
  "2S": [
    {
      label: "No Preference",
      value: "",
    },
    {
      label: "Window Side",
      value: "WS",
    },
  ],
  CC: [
    {
      label: "No Preference",
      value: "",
    },
    {
      label: "Window Side",
      value: "WS",
    },
  ],
  EV: [
    {
      label: "No Preference",
      value: "",
    },
    {
      label: "Window Side",
      value: "WS",
    },
  ],
  EC: [
    {
      label: "No Preference",
      value: "",
    },
    {
      label: "Window Side",
      value: "WS",
    },
  ],
  SL: [
    {
      label: "No Preference",
      value: "",
    },
    {
      label: "Lower",
      value: "LB",
    },
    {
      label: "Middle",
      value: "MB",
    },
    {
      label: "Upper",
      value: "UB",
    },
    {
      label: "Side Lower",
      value: "SL",
    },
    {
      label: "Side Upper",
      value: "SU",
    },
  ],
  "3E": [
    {
      label: "No Preference",
      value: "",
    },
    {
      label: "Lower",
      value: "LB",
    },
    {
      label: "Middle",
      value: "MB",
    },
    {
      label: "Upper",
      value: "UB",
    },
    {
      label: "Side Lower",
      value: "SL",
    },
    {
      label: "Side Upper",
      value: "SU",
    },
  ],
  "3A": [
    {
      label: "No Preference",
      value: "",
    },
    {
      label: "Lower",
      value: "LB",
    },
    {
      label: "Middle",
      value: "MB",
    },
    {
      label: "Upper",
      value: "UB",
    },
    {
      label: "Side Lower",
      value: "SL",
    },
    {
      label: "Side Upper",
      value: "SU",
    },
  ],
  "2A": [
    {
      label: "No Preference",
      value: "",
    },
    {
      label: "Lower",
      value: "LB",
    },
    {
      label: "Upper",
      value: "UB",
    },
    {
      label: "Side Lower",
      value: "SL",
    },
    {
      label: "Side Upper",
      value: "SU",
    },
  ],
  "1A": [
    {
      label: "No Preference",
      value: "",
    },
    {
      label: "Lower",
      value: "LB",
    },
    {
      label: "Upper",
      value: "UB",
    },
    {
      label: "Cabin",
      value: "CB",
    },
    {
      label: "Coupe",
      value: "CP",
    },
  ],
};

const reservationChoiceList = [
  { value: "Reservation Choice", label: "Reservation Choice" },
  {
    value: "Book, only if all berths are allotted in same coach.",
    label: "Book, only if all berths are allotted in same coach.",
  },
  {
    value: "Book, only if at least 1 lower berth is allotted.",
    label: "Book, only if at least 1 lower berth is allotted.",
  },
  {
    value: "Book, only if 2 lower berths are allotted.",
    label: "Book, only if 2 lower berths are allotted.",
  },
];

// autoUpgradation - checkbox

const user_data = {
  journey_details: {
    from: {
      hindi_label: "अकोला जं",
      english_label: "AKOLA JN",
      station_code: "AK",
    },
    destination: {
      hindi_label: "छशिवाजी महाट",
      english_label: "C SHIVAJI MAH T",
      station_code: "CSTM",
    },
    date: "2023-01-25",
    class: {
      label: "AC 3 Tier (3A)",
      value: "3A",
    },
    quota: {
      label: "GENERAL",
      value: "GN",
    },
  },
  irctc_credentials: {
    user_name: "ReShAmA03",
    password: "GRAs2006",
  },
  passenger_details: [
    {
      name: "Amit Nemade",
      age: "22",
      berth: "LB",
    },
    {
      name: "Srujal Nemade",
      age: "14",
      berth: "UB",
    },
    {
      name: "Reshama Nemade",
      age: "40",
      gender: "F",
      berth: "SU",
    },
  ],
  infant_details: [
    {
      name: "Parth Patil",
      age: "1",
    },
  ],
  contact_details: {
    mobileNumber: "7385492903",
    email: "amitnemade34@gmail.com",
  },
  gst_details: {},
  payment_preferences: {
    paymentType: "2",
  },
  travel_preferences: {
    travelInsuranceOpted: "yes",
  },
  other_preferences: {
    autoUpgradation: true,
    confirmberths: true,
    coachId: "s8",
    reservationChoice: "Book, only if all berths are allotted in same coach.",
  },
};

const user_data_with_gst = {
  journey_details: {
    from: {
      hindi_label: "अकोला जं",
      english_label: "AKOLA JN",
      station_code: "AK",
    },
    destination: {
      hindi_label: "छशिवाजी महाट",
      english_label: "C SHIVAJI MAH T",
      station_code: "CSTM",
    },
    date: "2023-01-25",
    class: {
      label: "AC 3 Tier (3A)",
      value: "3A",
    },
    quota: {
      label: "TATKAL",
      value: "TQ",
    },
  },
  irctc_credentials: {
    user_name: "ReShAmA03",
    password: "GRAs2006",
  },
  passenger_details: [
    {
      name: "Amit Nemade",
      age: "22",
      berth: "LB",
    },
    {
      name: "Srujal Nemade",
      age: "14",
      berth: "UB",
    },
    {
      name: "Reshama Nemade",
      age: "40",
      gender: "F",
      berth: "SU",
    },
  ],
  infant_details: [
    {
      name: "Parth Patil",
      age: "1",
    },
  ],
  contact_details: {
    mobileNumber: "7385492903",
    email: "amitnemade34@gmail.com",
  },
  gst_details: {
    "gstin-number": "33AAECF3991L1ZB",
    "gstin-name": "F Labs Global PVT LTD",
    "gstin-flat": "766",
    "gstin-street": "Off Cenotaph Road",
    "gstin-area": "Rathna Nagar",
    "gstin-PIN": "444004",
    "gstin-City": "Akola",
  },
  payment_preferences: {
    paymentType: "2",
  },
  travel_preferences: {
    travelInsuranceOpted: "yes",
  },
  other_preferences: {
    autoUpgradation: true,
    confirmberths: true,
    coachId: "s8",
    reservationChoice: "Book, only if all berths are allotted in same coach.",
  },
};
