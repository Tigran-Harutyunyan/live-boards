<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { SignIn } from "vue-clerk";
</script>

<template>
  <AuthLayout>
    <SignIn sign-up-url="/sign-up" />
  </AuthLayout>
</template>
