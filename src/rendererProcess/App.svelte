<style global>
  body {
    min-height: 100vh;
    margin: auto;
    padding: 25px 50px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji;
  }
</style>

<script>
  import Router, { wrap, push } from "svelte-spa-router";

  import ImportSettings from "/screens/ImportSettings.svelte";
  import CharactersList from "/screens/CharactersList.svelte";
  import Settings from "/screens/Settings.svelte";
  import FirstStart from "/screens/FirstStart.svelte";
  import Notifications from "/components/Notifications.svelte";

  import { settingsStore } from "/stores/settings.js";
  const { ipcRenderer } = require("electron");

  ipcRenderer
    .invoke("readSettings")
    .then(result => {
      result && set(result);
    })
    .catch(error => {
      console.log("Ошибка при чтении настроек", error);
    });

  console.log(Notifications.test);

  const wrapper = component =>
    wrap(component, () => $settingsStore.isLoaded || push("/first-start"));

  const routes = {
    "/first-start": FirstStart,
    "/settings": wrapper(Settings),
    "/import-settings": ImportSettings,
    "/": wrapper(CharactersList),
  };
</script>

<main>
  <Notifications />
  <Router routes="{routes}" />
</main>
