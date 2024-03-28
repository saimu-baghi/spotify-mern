import Link from "next/link";

import { hash as bcryptHash } from "bcrypt";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/lib/form";
import { generateId } from "lucia";
const mongoose = require("mongoose");
import { Users } from "../lib/models";

import { connectToDB } from "../lib/utils";

export default async function Page() {
	const { user } = await validateRequest();
	if (user) {
		return redirect("/");
	}
	return (
		<>
			<h1>Create an account</h1>
			<Form action={signup}>
				<label htmlFor="username">Username</label>
				<input name="username" id="username" />
				<br />
				<label htmlFor="email">Email</label>
				<input name="email" id="email" />
				<br />
				<label htmlFor="isAdmin">isAdmin?</label>
				<input type="checkbox" id="isAdmin" name="isAdmin" />
				<br />
				<label htmlFor="password">Password</label>
				<input type="password" name="password" id="password" />
				<br />
				<button>Continue</button>
			</Form>
			<Link href="/login">Sign in</Link>
		</>
	);
}

async function signup(_, formData) {
	"use server";
	const username = formData.get("username");
	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: "Invalid username"
		};
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return {
			error: "Invalid password"
		};
	}

	// const hashedPassword = await new Argon2id().hash(password);
	const hashedPassword = await bcryptHash(password, 10);
	const userId = generateId(15);
	const email = formData.get("email");
	const isAdmin = formData.get("isAdmin");


	try {
		await connectToDB()

		await Users.create({ _id: userId, username: username, email: email, password: hashedPassword });
	  
		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	  } catch (e) {
		if (e.code === 11000) {
		  return {
			error: "Username already used",
		  };
		}
		return {
		  error: "An unknown error occurred",
		};
	  }
	return redirect("/");
}
