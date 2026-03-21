// Shared church content data — based on official ABCMI documents.
// This acts as the single source of truth for content used on the website
// and in the admin content editor. In production, this would be stored in a database.

export const churchContent = {
  mission: {
    title: "Mission Statement",
    body: "To teach, train, and equip strong faithful servants to establish local and house churches, relationally joined together to the Holy Spirit in fulfilling the God given vision.",
  },

  vision: {
    title: "Vision Statement",
    body: "We are God's servants building His wall of salvation to the nations (peoples, tribes, and tongues) laid and founded upon the chief cornerstone, Jesus Christ.",
    drivingForce: "Love, Burden, Commitment, and Compassion for the Lost",
  },

  coreValues: [
    { title: "God First" },
    { title: "Lordship of Christ" },
    { title: "Faithful Service" },
    { title: "Holy Spirit Driven" },
    { title: "Transformative Discipleship" },
    { title: "Local and Global Missions" },
  ],

  statementOfFaith: {
    title: "Statement of Fundamentals of Truth and Faith",
    intro: "The fundamental teachings of the ABCMI congregation are reflected in the following clear statements of faith:",
    beliefs: [
      "We believe in the One True God",
      "We believe in the Deity of Christ",
      "We believe in the Scripture as Inspired by God",
      "We believe in the Fall of Man and a hope for Salvation",
      "We believe in the Sanctification of Man",
      "We believe in the Two Ordinances of the Church",
      "We believe in the Baptism of the Holy Spirit",
      "We believe in the Divine Healing",
      "We believe in the Coming back of Christ",
      "We believe in God's Ordained Institutions and Authority",
      "We believe in the Church and Its Mission",
      "We believe in the Final Judgement",
      "We believe in the Millennial Reign of Christ",
      "We believe in the New Heavens and the New Earth",
    ],
  },

  history: {
    title: "Our Journey of Faith",
    subtitle: "Since 1984",
    timeline: [
      { year: "1984", event: "The revival began at Quirino Hill Barangay/Village." },
      { year: "1986", event: "Arise and Build For Christ Ministries was founded by Rev. Marino S. Coyoy and Elizabeth L. Coyoy. It started as a house church." },
      { year: "1990", event: "A new location and a wider worship space were provided." },
      { year: "1991", event: "A daughter church was started by Ptr. Ernesto Paleyan in Patiacan, Quirino, Ilocos Sur." },
      { year: "1992", event: "Another wider space was provided to accommodate more people." },
      { year: "1994", event: "A parcel of land was donated by Col. Hover S. Coyoy, which became a permanent place of worship. Additional pastoral team members were added." },
      { year: "1995", event: "Church planting started at Camp 8, Baguio City." },
      { year: "1997", event: "Arise and Build For Christ Ministries Inc. became the registered name under the SEC." },
      { year: "2000", event: "Church planting began at Nangobongan, San Juan, Abra." },
      { year: "2004", event: "Church planting started at Manabo, Abra through Ptr. Elmo Salingbay." },
      { year: "2007", event: "Ptr. Ysrael L. Coyoy became the resident pastor of ABCMI Quirino Hill." },
      { year: "2009", event: "Church planting started at Maria Aurora, Aurora." },
      { year: "2012", event: "Church planting began at Lower Decoliat, Alfonso Castañeda, Nueva Vizcaya." },
      { year: "2014", event: "A house church started through Bible study with the Bayanos family in San Carlos, Baguio City." },
      { year: "2015", event: "House churches started at Idogan, San Carlos (March) and Kias, Baguio City (September)." },
      { year: "2016", event: "Church planting started at Dalic, Bontoc, Mt. Province." },
      { year: "2017", event: "Church planting started at Ansagan, Tuba, Benguet." },
      { year: "2019", event: "VBS, Crusade, and Church Planting were conducted at Abas, Sallapadan, Abra." },
      { year: "2023", event: "The church adopted church planting works at Tuding, Itogon, Benguet and in Vientiane, Laos (November)." },
      { year: "2024", event: "Church planting started at Palina, Tuba, Benguet (March)." },
    ],
  },
}

export type ChurchContent = typeof churchContent
