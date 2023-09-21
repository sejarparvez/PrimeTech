const Options = [
  "Technology News",
  "HotPost",
  "Featured",
  "Programming",
  "Web Development",
  "Mobile Apps",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "Internet of Things",
  "Tech Reviews",
  "Software Development",
  "Virtual Reality",
  "Robotics",
  "Hardware",
  "Networking",
  "Databases",
  "Operating Systems",
  "DevOps",
  "Linux",
];

const optionsWithLinks = Options.map((option) => ({
  value: option.toLowerCase().replace(/\s+/g, "_"),
  label: option,
}));

// Sort the array alphabetically by the 'label' property
optionsWithLinks.sort((a, b) => a.label.localeCompare(b.label));

export default optionsWithLinks;
