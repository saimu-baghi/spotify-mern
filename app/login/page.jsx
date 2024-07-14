import Link from "next/link";

import bcrypt from "bcrypt";

// import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/lib/form";
import { Users } from "../lib/models";
import styles from "../ui/login/loginForm/loginForm.module.css";
import { connectToDB } from "../lib/utils";

export default async function Page() {
	const { user } = await validateRequest();
	if (user) {
		return redirect("/admin");
	}
	return (
		<div className="flex flex-col justify-center items-center">
			<Form action={login} className={styles.form}>
			<h1>Login</h1>
				<input name="username" id="username" placeholder="Username" />
				<input type="password" name="password" id="password" placeholder="Password" />
				<button>Login</button>
			</Form>
		</div>
	);
}

async function login(_, formData){
	"use server";
	const username = formData.get("username");
	// if (
	// 	typeof username !== "string" ||
	// 	username.length < 3 ||
	// 	username.length > 31 ||
	// 	!/^[a-z0-9_-]+$/.test(username)
	// ) {
	// 	return {
	// 		error: "Invalid username"
	// 	};
	// }
	const password = formData.get("password");
	// if (typeof password !== "string" || password.length < 6 || password.length > 255) {
	// 	return {
	// 		error: "Invalid password"
	// 	};
	// }

	try {
		
		await connectToDB();

		const existingUser = await Users.findOne({ username: username });
	  
		if (!existingUser || !existingUser.isAdmin) {
		  return {
			error: "Incorrect username or password",
		  };
		}

		// const validPassword = await new Argon2id().verify(existingUser.password, password);
		const validPassword = await bcrypt.compare(password, existingUser.password);
		// const validPassword = await bcrypt.compare(
		// 	password,
		// 	existingUser.password
		//   );
	  
		// const validPassword = await existingUser.verifyPassword(password);
	  
		if (!validPassword) {
		  return {
			error: "Incorrect username or password",
		  };
		}
	  
		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		return redirect("/admin");
	  } catch (e) {
		return {
		  error: "An unknown error occurred",
		};
	  }
}
