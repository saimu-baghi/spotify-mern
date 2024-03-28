import Link from "next/link";

import { hash as bcryptHash } from "bcrypt";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Form } from "@/lib/form";
import { generateId } from "lucia";
const mongoose = require("mongoose");

import {connectMongoDB} from '@/lib/mongodb';


export default async function Page() {
	const { user } = await validateRequest();
	if (user) {
		return redirect("/admin");
	}
	return (
		<>
			<h1>Create an account</h1>
			<Form action={signup}>
				<label htmlFor="username">Username</label>
				<input name="username" id="username" />
				<br />
				<label htmlFor="password">Password</label>
				<input type="password" name="password" id="password" />
				<br />
				<label htmlFor="email">Email</label>
				<input type="email" name="email" id="email" />
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
	const email = formData.get("email");


	// const hashedPassword = await new Argon2id().hash(password);
	const hashedPassword = await bcryptHash(password, 10);
	const userId = generateId(15);

	try {
		await connectMongoDB()
		
		const User = mongoose.models["User"] || mongoose.model(
			"User",
			new mongoose.Schema(
				{
					username: {
						type: String,
						// required: true,
						unique: true,
						min: 3,
						max: 20,
					  },
					  email: {
						type: String,
						required: true,
						unique: true,
					  },
					  password: {
						type: String,
						required: true,
					  },
					  img: {
						type: String,
					  },
					  isAdmin: {
						type: Boolean,
						default: false,
					  },
					  isActive: {
						type: Boolean,
						default: true,
					  },
					  phone: {
						type: String,
					  },
					  address: {
						type: String,
					  },
					},
					{ timestamps: true }
			)
		);

		await User.create({ username: username, email: email, password: hashedPassword });
	  
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
	return redirect("/admin");
}
