import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [deploymentInfo, setDeploymentInfo] = useState({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    buildId: process.env.REACT_APP_BUILD_ID || 'local-development'
  });

  useEffect(() => {
    // You could fetch additional configuration or deployment info
    // from a backend API or environment variables here
    document.title = `AWS S3 Deployed React App - ${deploymentInfo.environment}`;
  }, [deploymentInfo.environment]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React App Deployed to AWS S3</h1>
        <p>
          This application is deployed via AWS CodePipeline with GitHub integration.
        </p>
        <div className="deployment-info">
          <h3>Deployment Information</h3>
          <p>Environment: <code>{deploymentInfo.environment}</code></p>
          <p>Build ID: <code>{deploymentInfo.buildId}</code></p>
          <p>Deployment Time: <code>{deploymentInfo.timestamp}</code></p>
        </div>
        <a
          className="App-link"
          href="https://github.com/YOUR_USERNAME/Aws-codepipeline-github"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </header>
    </div>
  );
}

export default App;
