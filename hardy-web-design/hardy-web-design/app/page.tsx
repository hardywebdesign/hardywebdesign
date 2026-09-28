import { redirect } from "next/navigation";

// The questionnaire is the only page for now. When the portfolio is ready, it can live here.
export default function Home() {
  redirect("/questionnaire");
}
