"use server";
import {SettingsView} from "./settings.view";
import { auth } from "@/lib/auth";


export default async function SettingsPage() {
  const sessionData = await auth();

  return (
    <SettingsView sessionData={sessionData}/>
  );
}
