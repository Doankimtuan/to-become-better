import Welcome from "~/welcome";
import type { Route } from "./+types/home";
import { ModalProvider } from "~/components/ModalUseContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <ModalProvider>
      <Welcome />
    </ModalProvider>
  );
}
