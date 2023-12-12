const initAddressComponentsByType: {
  [k: string]: google.maps.GeocoderAddressComponent;
} = {};

export const parsePlaceResult = (place: google.maps.places.PlaceResult) => {
  const addressComponentsByType = (place.address_components || []).reduce(
    function (acc, data) {
      data.types.forEach(function (type) {
        acc[type] = data;
      });
      return acc;
    },
    initAddressComponentsByType
  );

  const placeGet = (key: string, short = false) => {
    if (!(key in addressComponentsByType)) return null;

    return short
      ? addressComponentsByType[key].short_name
      : addressComponentsByType[key].long_name;
  };

  const result = {
    title: place.name,
    formattedAddress: place.formatted_address,
    externalId: place.place_id,
    externalUrl: place.url,
    houseNumber: placeGet("street_number"),
    street: placeGet("route"),
    city:
      placeGet("locality") ||
      placeGet("sublocality") ||
      placeGet("sublocality_level_1") ||
      placeGet("neighborhood") ||
      placeGet("administrative_area_level_3") ||
      placeGet("administrative_area_level_2"),
    county: placeGet("administrative_area_level_2"),
    stateShort: placeGet("administrative_area_level_1", true),
    stateLong: placeGet("administrative_area_level_1"),
    countryCode: placeGet("country", true),
    countryLong: placeGet("country"),
    postalCode: placeGet("postal_code"),
  };

  return result;
};

export type ParsedPlaceResult = ReturnType<typeof parsePlaceResult>;
