<script>
  import notifications from "/stores/notification.js";
</script>

<template>
  <div class="absolute-wrapper">
    {#each $notifications as notification}
      <div class="toast">
        {#if notification.cancelable}
          <button class="btn btn-clear float-right"></button>
        {/if}
        {notification.message}
      </div>
    {/each}
  </div>
</template>
