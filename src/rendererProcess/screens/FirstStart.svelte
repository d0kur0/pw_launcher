<style>
  .dots-animate::after {
    content: "";
    animation-name: dotsAnimate;
    animation-duration: 2.5s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }

  @keyframes dotsAnimate {
    0% {
      content: "";
    }
    25% {
      content: ".";
    }
    50% {
      content: "..";
    }
    75% {
      content: "...";
    }
    100% {
      content: "";
    }
  }
</style>

<script>
  import { writable } from "svelte/store";
  import { settingsStore } from "/stores/settings.js";
  import { push, link } from "svelte-spa-router";

  let componentState = writable({
    isLauncherPathValid: undefined,
    gamePath: null,
  });

  const selectFolderOfGame = () => {
    const { ipcRenderer } = require("electron");
    ipcRenderer
      .invoke("selectFolderOfGame")
      .then(({ isClientExists, gamePath }) => {
        componentState.update(state => ({
          ...state,
          isLauncherPathValid: isClientExists,
          gamePath,
        }));

        if (isClientExists) {
          settingsStore.setGamePath(gamePath);
          setTimeout(() => push("/"), 3000);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
</script>

<template>
  {#if !$componentState.isLauncherPathValid}
    <h5>✨ Первый запуск</h5>

    <p class="mt-2">
      Кажется, Вы впервые запускаете лаунчер на данном компьютере.
      <br />
      Первое, что нужно сделать - немного настроить лаунчер, всё, что сейчас
      нужно - указать путь к папке с игрой.
    </p>

    <div
      class="form-group"
      class:has-success="{$componentState.isLauncherPathValid === true}"
      class:has-error="{$componentState.isLauncherPathValid === false}"
    >
      <label class="form-label" for="game-path">
        Выберите папку с игрой, где находится elementclient.exe
      </label>
      <div class="input-group">
        <button
          on:click="{selectFolderOfGame}"
          class="btn btn-primary input-group-btn"
        >
          Выбрать
        </button>
        <input
          bind:value="{$componentState.gamePath}"
          class="form-input"
          type="text"
          id="game-path"
          disabled
        />
      </div>

      {#if $componentState.isLauncherPathValid === false}
        <p class="form-input-hint">
          В выбранной папке нет elementclient.exe, выберите другую.
        </p>
      {/if}

      <p style="margin-top: 25px">
        Вы так же можете импортировать настройки и персонажей из другого
        лаунчера.
        <a href="/import-settings" use:link>
          Открыть окно импортирования настроек
        </a>
      </p>
    </div>
  {:else}
    <h5 class="dots-animate">💖 Сохраняем настройки</h5>
    <p class="mt-2">
      Отлично! Есть всё, для того, чтобы начать пользоваться лаунчером.
      <br />
      Подождите пожалуйста несколько секунд, пока идёт сохранение.
    </p>
  {/if}
</template>
