const axios = require("axios");

async function getLocationDetails(query, accessToken) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.features && data.features.length > 0) {
      const place = data.features[0];
      return {
        name: place.place_name.split(",")[0],
        address: place.place_name,
        latitude: place.center[1],
        longitude: place.center[0],
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null;
  }
}

async function lookupNameAndAddressFromCoordinates(
  latitude,
  longitude,
  accessToken
) {
  const query = `${longitude},${latitude}`;
  return await getLocationDetails(query, accessToken);
}

async function lookupCoordinatesAndNameFromAddress(address, accessToken) {
  return await getLocationDetails(address, accessToken);
}

async function lookupCoordinatesAndAddressFromName(name, accessToken) {
  try {
    const { latitude, longitude } = await lookupCoordinatesAndNameFromAddress(
      name,
      accessToken
    );
    const { name: locationName, address } =
      await lookupNameAndAddressFromCoordinates(
        latitude,
        longitude,
        accessToken
      );
    return { name: locationName, address, latitude, longitude };
  } catch (error) {
    console.error("Error looking up coordinates and address from name:", error);
    return null;
  }
}

module.exports = {
  lookupNameAndAddressFromCoordinates,
  lookupCoordinatesAndNameFromAddress,
  lookupCoordinatesAndAddressFromName,
};
