<script lang="ts">
  import { loadGooglePlacesLibrary } from "./googlePlaceLibraryLoader.js";
  import { createEventDispatcher, onMount } from "svelte";

  export let apiKey: string;
  export let options = undefined;
  export let placeholder = undefined;
  export let value = "";
  export let required = false;
  export let pattern = "";

  export let onSelect: (data: google.maps.places.PlaceResult) => void;

  const dispatch = createEventDispatcher();

  let inputField;
  $: selectedLocationName = value || "";

  onMount(() => {
    loadGooglePlacesLibrary(apiKey, () => {
      const autocomplete = new google.maps.places.Autocomplete(inputField, {
        ...options,
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        // There are circumstances where the place_changed event fires, but we
        // were NOT given location data. I only want to propagate the event if we
        // truly received location data from Google.
        // See the `Type something, no suggestions, hit Enter` test case.
        if (hasLocationData(place)) {
          onSelect(place);
          setSelectedLocation({
            place: place,
            text: inputField.value,
          });
        }
      });

      dispatch("ready");
      setTimeout(() => {
        inputField.setAttribute("autocomplete", "one-time-code");
      }, 500);
    });
  });

  function emptyLocationField() {
    inputField.value = "";
    onChange();
  }

  function hasLocationData(place) {
    const fieldsToLookFor = (options && options.fields) || ["geometry"];
    return place.hasOwnProperty(fieldsToLookFor[0]);
  }

  function onChange() {
    if (inputField.value === "") {
      setSelectedLocation(null);
    }
  }

  function onKeyDown(event) {
    const suggestionsAreVisible =
      document.getElementsByClassName("pac-item").length;

    if (event.key === "Enter" || event.key === "Tab") {
      if (suggestionsAreVisible) {
        const isSuggestionSelected =
          document.getElementsByClassName("pac-item-selected").length;
        if (!isSuggestionSelected) {
          selectFirstSuggestion();
        }
      } else if (doesNotMatchSelectedLocation(inputField.value)) {
        setTimeout(emptyLocationField, 10);
      }
    } else if (event.key === "Escape") {
      setTimeout(emptyLocationField, 10);
    }

    if (suggestionsAreVisible) {
      if (event.key === "Enter") {
        /* When suggestions are visible, don't let an 'Enter' submit a form (since
         * the user is interacting with the list of suggestions at the time, not
         * expecting their actions to affect the form as a whole). */
        event.preventDefault();
      }
    }
  }

  function selectFirstSuggestion() {
    // Simulate the 'down arrow' key in order to select the first suggestion:
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
    const simulatedEvent = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      code: "ArrowDown",
      keyCode: 40,
    });
    inputField.dispatchEvent(simulatedEvent);
  }

  function setSelectedLocation(data) {
    selectedLocationName = (data && data.text) || "";
    dispatch("place_changed", data);
  }

  function doesNotMatchSelectedLocation(value) {
    return selectedLocationName !== value;
  }
</script>

<input
  bind:this={inputField}
  class={$$props.class}
  class:input={true}
  on:change={onChange}
  on:keydown={onKeyDown}
  {placeholder}
  {value}
  {required}
  {pattern}
/>

<style lang="scss" global>
  .autocomplete-container {
    width: 100%;
    position: relative;
    font-family:
      PP Neue Montreal Variable,
      sans-serif;
  }
  .result-list {
    background: white;
    position: absolute;
    bottom: 44px;
    padding: 0;
    margin: 0;
    width: 100%;
    left: 0;
  }
  .location-search-input {
    border: none;
    background: rgba(250, 254, 255, 0.97);
    border-radius: 12px;
    height: 44px;
    border: none !important;
    outline: none !important;
    &.focused {
      border-radius: 0 0 12px 12px;
    }
  }

  .pac-container {
    border-radius: 12px;

    .pac-item {
      padding: 0 16px;
      line-height: 44px;
      font-family:
        PP Neue Montreal Variable,
        sans-serif;
    }
    &:after {
      display: none !important;
    }
  }

  .pac-icon.pac-icon-marker {
    display: none;
  }
</style>
