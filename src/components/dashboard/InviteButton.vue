<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { OrganizationProfile } from "vue-clerk";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-vue-next";
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">
        <Plus class="h-4 w-4 mr-2" />
        Invite members
      </Button>
    </DialogTrigger>
    <DialogContent class="p-0 bg-transparent border-none max-w-[880px]">
      <OrganizationProfile />
    </DialogContent>
  </Dialog>
</template>
