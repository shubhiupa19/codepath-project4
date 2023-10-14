import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file for styling

const App = () => {
  const [dogData, setDogData] = useState(null);
  const [bannedAttributes, setBannedAttributes] = useState([]);

  const fetchDogData = async () => {
    try {
      const response = await fetch('https://api.thedogapi.com/v1/images/search');
      const data = await response.json();
  
      if (data && data.length > 0 && data[0].id) {
        const dogId = data[0].id;
        const dogResponse = await fetch(`https://api.thedogapi.com/v1/images/${dogId}`);
        const dogDetails = await dogResponse.json();
  
        if (dogDetails && dogDetails.breeds && dogDetails.breeds.length > 0) {
          const { life_span, name, weight } = dogDetails.breeds[0];
          console.log(dogDetails.breeds[0],life_span, name, weight);
          const imperialWeight = weight ? weight.imperial : 'N/A';
  
          if (bannedAttributes.includes(life_span) || bannedAttributes.includes(name) || bannedAttributes.includes(weight)) {
            // If all banned attributes are present, retry until successful
            fetchDogData();
          } else {
            // If no banned attributes are present, set the dogData state
            setDogData({
              id: dogDetails.id,
              url: dogDetails.url,
              life_span,
              name,
              imperialWeight
            });
          }
        } else {
          // If no breed details are available, retry until successful
          fetchDogData();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleAttributeClick = (attribute) => {
    if (!bannedAttributes.includes(attribute)) {
      setBannedAttributes([...bannedAttributes, attribute]);
    }
  };
  

  useEffect(() => {
    fetchDogData();
  }, []); // Fetch dog data on initial render

  const handleDiscoverClick = () => {
    fetchDogData();
  };

  return (
    <div className="app-container">
      <div className="dog-container">
        <h1>Discover Your Dog</h1>
        <h2>Click an attribute to ban it!</h2>

        <div className="attributes">
          <span className="attribute" onClick={() => handleAttributeClick(dogData.life_span)}>
            Life Span (years): {dogData && dogData.life_span}
          </span>
          <span className="attribute" onClick={() => handleAttributeClick(dogData.imperialWeight)}>
            Weight (lbs): {dogData && dogData.imperialWeight}
          </span>
          <span className="attribute" onClick={() => handleAttributeClick(dogData.name)}>
            name: {dogData && dogData.name}
          </span>
        </div>
        <img src={dogData && dogData.url} alt="Dog" className="dog-image" />
        <button onClick={handleDiscoverClick} className="discover-button">
          Discover
        </button>
      </div>
      <div className="ban-list">
        <h3>Banned Attributes</h3>
        <ul>
          {bannedAttributes.map((attribute) => (
            <li key={attribute}>{attribute}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default App;
