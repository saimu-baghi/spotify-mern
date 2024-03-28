import { Lucia } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import mongoose from "mongoose";

import { cookies } from "next/headers";
import { cache } from "react";

// import type { DatabaseUser } from "./db";
import {connectToDB} from '@/app/lib/utils'

// import { webcrypto } from "crypto";
// globalThis.crypto = webcrypto as Crypto;

// await mongoose.connect('mongodb+srv://admin:admin123@cluster0.fbwnsy1.mongodb.net/test2?retryWrites=true&w=majority');

await connectToDB()
const User = mongoose.models["User"] || mongoose.model(
	"User",
	new mongoose.Schema(
		{
			_id: {
				type: String,
				required: true,
			},
			username: {
				type: String,
			},
			password: {
				type: String,
			},
		},
		{ _id: false }
	)
);

const Session = mongoose.models["Session"] || mongoose.model(
    "Session",
    new mongoose.Schema(
        {
            _id: {
                type: String,
                required: true
            },
            user_id: {
                type: String,
                required: true
            },
            expires_at: {
                type: Date,
                required: true
            }
        },
        { _id: false }
    )
);

const adapter = new MongodbAdapter(
    mongoose.connection.collection("sessions"),
    mongoose.connection.collection("users")
);


export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

export const validateRequest = cache(
	async () => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
		return result;
	}
);