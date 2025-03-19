# ReactFlow Vite Project

This project is a React workflow visualization application built using [ReactFlow](https://reactflow.dev/) and powered by [Vite](https://vitejs.dev/).

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Fathima-Sharin/Workflow
   cd Workflow
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Application
1. Start the development server:
   ```sh
   npm run dev
   ```

2. Open the application in your browser. The default URL is usually:
   ```
   http://localhost:5173
   ```

### Running the JSON Server
This project also uses a JSON server for data management. Follow these steps to set it up:

1. Open a new terminal in the project directory.
2. Install JSON Server:
   ```sh
   npm install -g json-server
   ```
3. Start the server on port 5000:
   ```sh
   json-server --watch db.json --port 5000
   ```

### Project Structure
- `src/` - Contains the main React components and logic.
- `public/` - Static assets.
- `db.json` - JSON database for storing workflow-related data.

## Technologies Used
- React
- ReactFlow
- Vite
- JSON Server

## License
This project is licensed under the MIT License.

