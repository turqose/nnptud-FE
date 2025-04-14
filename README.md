# Running the Project

## Prerequisites
- Node.js installed
- npm or yarn installed

## Setup
1. Clone the repository:
    ```sh
    git clone https://github.com/tiendev2003/supplement_client.git
    cd supplement_client
    ```

2. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```properties
    VITE_API_URL=http://localhost:4000
    VITE_API_AI=your-api-key
    ```

## Running the Project
1. Start the development server:
    ```sh
    npm run dev
    # or
    yarn dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## Building for Production
1. Build the project:
    ```sh
    npm run build
    # or
    yarn build
    ```

2. Preview the production build:
    ```sh
    npm run serve
    # or
    yarn serve
    ```

## Additional Information
- Make sure to replace `your-api-key` with your actual API key.
- The development server will automatically use the environment variables defined in the `.env` file.
