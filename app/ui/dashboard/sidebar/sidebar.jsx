import Image from "next/image";
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";
import { lucia, validateRequest } from "@/lib/auth";
import { Form } from "@/lib/form";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const menuItems = [
  {
    title: "Pages",
    list: [
      // {
      //   title: "Dashboard",
      //   path: "/admin",
      //   icon: <MdDashboard />,
      // },
      {
        title: "Users",
        path: "/admin/users",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "Products",
        path: "/admin/products",
        icon: <MdShoppingBag />,
      },
      {
        title: "Transactions",
        path: "/admin/transactions",
        icon: <MdAttachMoney />,
      },
    ],
  },
  {
    title: "Analytics",
    list: [
      {
        title: "Revenue",
        path: "/admin/revenue",
        icon: <MdWork />,
      },
      {
        title: "Reports",
        path: "/admin/reports",
        icon: <MdAnalytics />,
      },
      {
        title: "Teams",
        path: "/admin/teams",
        icon: <MdPeople />,
      },
    ],
  },
  {
    title: "User",
    list: [
      {
        title: "Settings",
        path: "/admin/settings",
        icon: <MdOutlineSettings />,
      },
      {
        title: "Help",
        path: "/admin/help",
        icon: <MdHelpCenter />,
      },
    ],
  },
];

const Sidebar = async () => {
  const { user } = await validateRequest();
  async function logout() {
    "use server";
    const { session } = await validateRequest();
    if (!session) {
      return {
        error: "Unauthorized"
      };
    }
  
    await lucia.invalidateSession(session.id);
  
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/login");
  }
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src={user.img || "/noavatar.png"}
          alt=""
          width="50"
          height="50"
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>{user.username}</span>
          <span className={styles.userTitle}>Administrator</span>
        </div>
      </div>
      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      <Form action={logout}>
        <button className={styles.logout}>
          <MdLogout />
          Logout
        </button>
			</Form>   
    </div>
  );
};

export default Sidebar;
