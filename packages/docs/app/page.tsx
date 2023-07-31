import { redirect } from "next/navigation";

export default function IndexPage(): JSX.Element {
  return redirect("/docs/introduction");
}
