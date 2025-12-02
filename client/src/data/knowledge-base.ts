// Comprehensive Knowledge Base for JARVIS
export const knowledgeBase: { [key: string]: string } = {
  // ===== MACHINE LEARNING =====
  'machine learning': 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience. It uses algorithms to process data, identify patterns, and make decisions with minimal human intervention. Key components include supervised learning, unsupervised learning, and reinforcement learning.',
  'what is machine learning': 'Machine learning is technology that allows computers to learn from data without being explicitly programmed. It powers recommendation systems, voice assistants, image recognition, and autonomous vehicles.',
  'supervised learning': 'Supervised learning is when a model learns from labeled training data. Examples include predicting house prices given features, or classifying emails as spam or not spam.',
  'unsupervised learning': 'Unsupervised learning finds patterns in unlabeled data. Common techniques include clustering and dimensionality reduction.',
  'deep learning': 'Deep learning uses neural networks with many layers to learn complex patterns. It powers modern AI like ChatGPT, image recognition, and autonomous driving.',
  'neural networks': 'Neural networks are computing systems inspired by biological neurons. They consist of interconnected layers that process information and learn patterns through backpropagation.',
  'artificial intelligence': 'Artificial intelligence is the simulation of human intelligence by machines. It includes machine learning, natural language processing, computer vision, and robotics.',

  // ===== PROGRAMMING =====
  'python': 'Python is a high-level, interpreted programming language known for its simplicity and readability. It\'s widely used in data science, web development, automation, and AI.',
  'javascript': 'JavaScript is a versatile programming language that powers web browsers and servers. It enables interactive web pages, and with Node.js, can run on the backend.',
  'what is react': 'React is a JavaScript library for building user interfaces with reusable components. It uses a virtual DOM for efficient rendering and is maintained by Facebook.',
  'web development': 'Web development involves creating websites and web applications using HTML, CSS, and JavaScript. It includes frontend (client-side) and backend (server-side) development.',
  'frontend': 'Frontend is the client-side of web applications, handling UI/UX. Technologies include HTML, CSS, JavaScript, React, Vue, and Angular.',
  'backend': 'Backend is the server-side of applications, handling data processing, databases, and business logic. Technologies include Node.js, Python, Java, and databases.',
  'rest api': 'REST API is an architectural style for web services. It uses HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs.',
  'database': 'A database is an organized collection of data stored and accessed electronically. Types include relational databases like PostgreSQL, and NoSQL like MongoDB.',
  'sql': 'SQL is a language for querying and managing relational databases. It allows you to insert, update, delete, and retrieve data efficiently.',
  'html': 'HTML is the markup language for creating web pages. It defines the structure and content using elements like headings, paragraphs, links, and images.',
  'css': 'CSS is used for styling and laying out web pages. It controls colors, fonts, spacing, and responsive design.',
  'git': 'Git is a version control system that tracks changes in code. It enables collaboration, branching, and reverting to previous versions.',
  'docker': 'Docker is a containerization platform that packages applications with their dependencies. It ensures consistency across development and production environments.',
  'cloud computing': 'Cloud computing delivers computing services over the internet, including storage, processing power, and applications. Examples: AWS, Google Cloud, Azure.',

  // ===== DATA SCIENCE =====
  'data science': 'Data science combines statistics, programming, and domain knowledge to extract insights from data. It involves collecting, cleaning, analyzing, and visualizing data.',
  'data analysis': 'Data analysis is the process of examining raw data to discover patterns and insights. Tools include Python, R, SQL, and Tableau.',
  'big data': 'Big data refers to large volumes of structured and unstructured data that traditional tools can\'t process. Technologies like Hadoop and Spark handle big data.',
  'data visualization': 'Data visualization presents data graphically to make insights clear. Tools include Tableau, Power BI, Matplotlib, and Plotly.',
  'statistics': 'Statistics is the study of data collection, analysis, and interpretation. It includes descriptive statistics, inferential statistics, and probability.',
  'pandas': 'Pandas is a Python library for data manipulation and analysis. It provides DataFrames for handling structured data efficiently.',
  'numpy': 'NumPy is a Python library for numerical computing. It provides support for large arrays and matrices with mathematical functions.',

  // ===== CYBERSECURITY =====
  'cybersecurity': 'Cybersecurity protects computer systems and networks from unauthorized access and attacks. It includes firewalls, encryption, and security protocols.',
  'encryption': 'Encryption converts data into unreadable code using algorithms and keys. Only authorized parties with the correct key can decrypt it.',
  'hacking': 'Hacking is unauthorized access to computer systems. Ethical hackers help find vulnerabilities; malicious hackers exploit systems for harm.',
  'password': 'A strong password should be at least 12 characters, include uppercase, lowercase, numbers, and special characters. Avoid personal information.',
  'vpn': 'A VPN creates a secure encrypted connection over the internet, hiding your IP address and protecting your privacy.',
  'firewall': 'A firewall is a security system that monitors and filters network traffic to prevent unauthorized access.',

  // ===== GENERAL TECH =====
  'api': 'An API allows different software applications to communicate. It defines the methods and data formats for interaction between systems.',
  'framework': 'A framework is a foundation for building applications. It provides pre-built components, libraries, and design patterns to speed up development.',
  'library': 'A library is a collection of pre-written code and functions. Developers use libraries to avoid writing code from scratch.',
  'algorithm': 'An algorithm is a step-by-step procedure for solving a problem or accomplishing a task. Good algorithms are efficient and scalable.',
  'data structure': 'A data structure is a way of organizing and storing data. Examples: arrays, linked lists, trees, graphs, stacks, queues.',
  'debugging': 'Debugging is the process of finding and fixing errors in code. Tools include debuggers, logging, and unit tests.',
  'testing': 'Testing ensures software works correctly. Types include unit tests, integration tests, and end-to-end tests.',
  'agile': 'Agile is a software development methodology emphasizing iterative development, collaboration, and continuous improvement.',
  'devops': 'DevOps combines development and operations to streamline software delivery. It includes continuous integration and deployment.',
  'microservices': 'Microservices architecture breaks applications into small, independent services that communicate via APIs. It improves scalability and flexibility.',
  'blockchain': 'Blockchain is a distributed ledger technology that records transactions in linked blocks. It\'s the foundation for cryptocurrencies like Bitcoin.',
  'cryptocurrency': 'Cryptocurrency is digital money using cryptography for security. Examples include Bitcoin, Ethereum, and Litecoin.',
  'cloud storage': 'Cloud storage stores data on remote servers accessible over the internet. Services include Google Drive, Dropbox, and AWS S3.',

  // ===== MOBILE DEVELOPMENT =====
  'android': 'Android is Google\'s operating system for mobile devices. Apps are developed using Kotlin or Java, primarily in Android Studio.',
  'ios': 'iOS is Apple\'s operating system for iPhones and iPads. Apps are developed using Swift or Objective-C.',
  'flutter': 'Flutter is Google\'s framework for building cross-platform mobile apps. It uses Dart and compiles to native code for iOS and Android.',
  'react native': 'React Native allows building mobile apps using JavaScript and React. Code can run on both iOS and Android.',

  // ===== DEVOPS & INFRASTRUCTURE =====
  'kubernetes': 'Kubernetes is an open-source platform for automating containerized application deployment and scaling.',
  'jenkins': 'Jenkins is an automation server for continuous integration and continuous deployment.',
  'linux': 'Linux is an open-source operating system used widely in servers and cloud infrastructure.',
  'aws': 'AWS is Amazon\'s cloud computing platform offering services like EC2, S3, RDS, and Lambda.',
  'google cloud': 'Google Cloud Platform provides cloud computing services including Compute Engine, Cloud Storage, and BigQuery.',
  'azure': 'Microsoft Azure is a cloud platform offering virtual machines, databases, and AI services.',

  // ===== GENERAL KNOWLEDGE =====
  'what is coding': 'Coding is writing instructions for computers using programming languages. These instructions tell the computer what to do.',
  'programming': 'Programming is the process of creating software by writing code. It solves problems and automates tasks.',
  'software': 'Software is a program or collection of programs that run on computers. Examples: applications, operating systems, games.',
  'hardware': 'Hardware is the physical components of a computer. Examples: CPU, RAM, storage, keyboard, monitor.',
  'internet': 'The internet is a global network connecting computers worldwide, enabling data and communication exchange.',
  'server': 'A server is a computer that provides services and resources to other computers (clients) over a network.',
  'client': 'A client is a computer or application that requests services from a server.',
  'network': 'A network is a group of computers connected together for communication and resource sharing.',

  // ===== CAREER & LEARNING =====
  'how to learn programming': 'Start with fundamentals: choose a language like Python, practice consistently, build projects, read code, and join communities. Online resources like Codecademy, Udemy, and freeCodeCamp are helpful.',
  'programming career': 'A programming career offers diverse paths: web development, mobile development, data science, AI/ML, DevOps, and more. Continuous learning is essential.',
  'best programming language': 'There\'s no best language; it depends on your goal. Python for beginners and data science, JavaScript for web, Java for enterprise.',
  'how to get better at coding': 'Practice daily, solve problems on platforms like LeetCode, build real projects, read others\' code, and participate in open source.',

  // ===== RANDOM FACTS =====
  'first computer': 'The first electronic general-purpose computer was ENIAC, built in 1945.',
  'first programming language': 'Plankalkül, created by Konrad Zuse in 1945, is considered the first high-level programming language.',
  'moore\'s law': 'Moore\'s Law states that the number of transistors on a chip doubles roughly every 2 years, leading to exponential computing growth.',
  'turing test': 'The Turing Test, proposed by Alan Turing, measures whether a machine can exhibit intelligent behavior indistinguishable from a human.',
};

export function getAnswer(question: string): string | null {
  const q = question.toLowerCase().trim();
  
  // Exact match
  if (knowledgeBase[q]) {
    return knowledgeBase[q];
  }
  
  // Partial match - find best match
  let bestMatch: string | null = null;
  let maxScore = 0;
  
  for (const [key, answer] of Object.entries(knowledgeBase)) {
    if (q.includes(key) || key.includes(q)) {
      const score = Math.min(q.length, key.length);
      if (score > maxScore) {
        maxScore = score;
        bestMatch = answer;
      }
    }
  }
  
  return bestMatch;
}
