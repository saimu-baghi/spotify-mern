import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

import { cards } from "../lib/data";
import Card from "../ui/dashboard/card/card";
import Chart from "../ui/dashboard/chart/chart";
import styles from "../ui/dashboard/dashboard.module.css";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import Transactions from "../ui/dashboard/transactions/transactions";


export default async function Page() {
	const { user } = await validateRequest();
	if (!user) {
		return redirect("/login");
	}
	return (
        <div className={styles.wrapper}>
          <div className={styles.main}>
            <div className={styles.cards}>
              {cards.map((item) => (
                <Card item={item} key={item.id} />
              ))}
            </div>
            <Transactions />
            <Chart />
          </div>
          <div className={styles.side}>
            <Rightbar />
          </div>
        </div>
      );
}


