<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { SignUp } from "vue-clerk";
</script>

<template>
  <AuthLayout>
    <SignUp sign-in-url="/sign-in" />
  </AuthLayout>
</template>
