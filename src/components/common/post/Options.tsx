const Options = [
  "Technology",
  "Programming",
  "Web Development",
  "Mobile Apps",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "IoT (Internet of Things)",
  "Tech Reviews",
  "Software Development",
  "Game Development",
  "Virtual Reality",
  "Augmented Reality",
  "Robotics",
  "Hardware",
  "Networking",
  "Databases",
  "Operating Systems",
  "Mobile Devices",
  "Computer Science",
]
  .map((option) => ({ value: option.toLowerCase(), label: option }))
  .sort((a, b) => a.label.localeCompare(b.label));

export default Options;
