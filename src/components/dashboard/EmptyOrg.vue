<script setup lang="ts">
import { CreateOrganization } from "vue-clerk";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import imgElements from "@/assets/images/elements.svg";
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center">
    <img :src="imgElements" alt="Empty" height="200" width="200" />
    <h2 class="text-2xl font-semibold mt-6">Welcome to Board</h2>
    <p class="text-muted-foreground text-sm mt-2">
      Create an organization to get started
    </p>
    <div class="mt-6">
      <Dialog>
        <DialogTrigger as-child>
          <Button size="lg"> Create organization </Button>
        </DialogTrigger>
        <DialogContent class="p-0 bg-transparent border-none max-w-[480px]">
          <CreateOrganization />
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
