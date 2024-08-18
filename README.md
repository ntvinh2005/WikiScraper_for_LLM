# Wikipedia Scraper for LLM Training Data

## Overview

**Wikipedia Scraper for LLM Training Data** is a robust web scraper designed to extract and organize information from Wikipedia. This tool gathers data to build a database of topic-related information, which is useful for training Large Language Models (LLMs). It captures text and links from Wikipedia pages and stores them in a structured format.

## Features

- Scrapes Wikipedia pages and their linked pages.
- Extracts and stores non-empty text blocks.
- Saves links to important Wikipedia pages.
- Organizes data into chunks with associated links.
- Provides a simple web interface for interacting with the scraper and viewing results.

## Technologies Used

- **Node.js**: JavaScript runtime for building the scraper.
- **Selenium**: Tool for automating web browsers and scraping web pages.
- **MongoDB**: NoSQL database for storing scraped data.
- **Express**: Web framework for building the server-side application.
- **HTML/CSS/JavaScript**: Static web technologies for the frontend.

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/wikipedia-scraper-llm-training-data.git
   cd wikipedia-scraper-llm-training-data
2. **Install dependencies:**
   ```bash
   npm install
3. **Set up environment variables:**
   ```bash
   MONGO_URI=your_mongodb_connection_string
4. **Start the server:**
   ```bash
   node server.js

## Usages
### Scraping data
1. **Open the frontend:**
   Navigate to http://localhost:3000 in your browser
2. **Enter Wikipedia page URLs:**
   Input the URLs of Wikipedia pages you want to scrape into the provided field and click "Scrape".
3. **View Results:**
   The scraper will display extracted text and links. Data is also stored in MongoDB.

### API Access
If you are interested in using the scraper's API for your own project, please contact me at ntvinhgv@gmail.com to get access.

## Contributing
Contributions to the project are welcome. Please follow these steps:
1. **Folk the repository.**
2. **Create a new branch:**
   ```bash
   git checkout -b feature/YourFeature
3. **Make your changes and commit:**
   ```bash
   git commit -m 'Add new feature'
4. **Push to your branch:**
   ```bash
   git push origin feature/YourFeature
5. **Open a Pull Request.**
   
## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contact
For questions, suggestions, or API access, please email ntvinhgv@gmail.com.

## Acknowledgement
- [Wikipedia](https://www.wikipedia.org/) for providing the data source.
- [Selenium](https://www.selenium.dev/) for web scraping automation.


 
