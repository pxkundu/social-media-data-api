# LinkedIn Data Analytics Platform

A self-hosted platform for personal LinkedIn data analytics and insights. This application allows you to fetch, analyze, and visualize your LinkedIn profile data, posts, and articles in a modern, user-friendly interface.

## Features

- **Profile Analytics**: View and analyze your LinkedIn profile data
- **Posts Analytics**: Track engagement and performance of your LinkedIn posts
- **Articles Analytics**: Monitor the performance of your LinkedIn articles
- **Data Visualization**: Interactive charts and graphs for better insights
- **Secure Configuration**: Encrypted storage of LinkedIn API credentials
- **Modern UI**: Clean, responsive interface inspired by LinkedIn's design

## Tech Stack

### Frontend
- React.js
- Material-UI
- Recharts for data visualization
- React Router for navigation

### Backend
- Python FastAPI
- LinkedIn API v2
- Cryptography for secure credential storage
- SQLite for local data storage

## Prerequisites

- Python 3.8+
- Node.js 14+
- LinkedIn Developer Account
- LinkedIn API Access

## Setup Instructions

### 1. LinkedIn Developer Setup

1. Go to [LinkedIn Developers Portal](https://www.linkedin.com/developers/apps)
2. Create a new app
3. Configure the following:
   - OAuth 2.0 settings
   - Redirect URL: `http://localhost:3000/api/auth/callback`
   - Required permissions:
     - `r_liteprofile`
     - `r_emailaddress`
     - `w_member_social`
     - `r_basicprofile`

### 2. Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd linkedin-data-analytics
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory:
   ```
   LINKEDIN_CLIENT_ID=your_client_id
   LINKEDIN_CLIENT_SECRET=your_client_secret
   LINKEDIN_ACCESS_TOKEN=your_access_token
   HOST=localhost
   PORT=8000
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### 3. Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Usage Guide

### 1. Configuration

1. Access the Configuration page through the navigation menu
2. Enter your LinkedIn API credentials:
   - Client ID
   - Client Secret
   - Access Token
3. Save the configuration (credentials are encrypted and stored securely)

### 2. Data Access

- **Profile**: View your LinkedIn profile data and analytics
- **Posts**: Analyze your LinkedIn posts' performance
- **Articles**: Track your LinkedIn articles' engagement
- **Analytics**: View comprehensive analytics and insights

### 3. Data Refresh

- Use the refresh button on each page to fetch the latest data
- Data is cached locally for better performance
- Manual refresh available for real-time updates

## Security Considerations

- All API credentials are encrypted using Fernet encryption
- Credentials are stored locally and never transmitted to external servers
- OAuth 2.0 implementation for secure authentication
- HTTPS recommended for production deployment

## Development

### Project Structure

```
linkedin-data-analytics/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   └── models/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

### Common Issues

1. **API Authentication Failed**
   - Verify your credentials in the Configuration page
   - Check if your LinkedIn app has the required permissions
   - Ensure your access token is valid

2. **Data Not Loading**
   - Check your internet connection
   - Verify backend server is running
   - Check browser console for errors

3. **Configuration Issues**
   - Ensure all required fields are filled
   - Check if the backend server is accessible
   - Verify the encryption key is properly set

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
1. Check the troubleshooting guide
2. Search existing issues
3. Create a new issue if needed

## Acknowledgments

- LinkedIn API Documentation
- FastAPI Documentation
- Material-UI Documentation
- React Documentation

## Deployment

### GitHub Pages Deployment

1. Fork this repository to your GitHub account
2. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Select 'gh-pages' branch as source
   - Save the settings

3. Set up GitHub Secrets:
   - Go to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `REACT_APP_API_URL`: Your backend API URL
     - `HEROKU_API_KEY`: Your Heroku API key
     - `HEROKU_APP_NAME`: Your Heroku app name

4. Push your changes to the main branch:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

5. The GitHub Actions workflow will automatically:
   - Build the frontend
   - Deploy it to GitHub Pages
   - Deploy the backend to Heroku

Your application will be available at: `https://<your-github-username>.github.io/linkedin-data-analytics`

### Environment Variables

For local development, create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:8000
```

For production, set the environment variables in your deployment platform:
- Frontend: Set `REACT_APP_API_URL` to your backend API URL
- Backend: Set all required LinkedIn API credentials

### Deployment Considerations

1. **CORS Configuration**
   - Update the backend CORS settings to allow requests from your GitHub Pages domain
   - Add your GitHub Pages URL to the allowed origins

2. **Security**
   - Use HTTPS for all API calls
   - Keep your API credentials secure
   - Regularly rotate your access tokens

3. **Performance**
   - Enable caching where appropriate
   - Use compression for API responses
   - Optimize frontend assets
