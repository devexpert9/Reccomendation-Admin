export class PageConfig {
	public defaults: any = {
		users: {
			page: { title: "Users", desc: "" },
			adduser: { page: { title: "Add User", desc: "" } },
			edituser: { page: { title: "Edit User", desc: "" } },
		},
		posts: {
			page: { title: "Posts", desc: "" },
			addpost: { page: { title: "Add Post", desc: "" } },
			editpost: { page: { title: "Edit Post", desc: "" } },
			comments: { page: { title: "Comments", desc: "" } },
		},
		categories: {
			page: { title: "Categories", desc: "" },
			addcategory: { page: { title: "Add Category", desc: "" } },
			editcategory: { page: { title: "Edit Category", desc: "" } },
		},
		following: {
			page: { title: "Following", desc: "" },
		},
		feedback: {
			page: { title: "Feedback", desc: "" },
		},

		reviews: {
			page: { title: "Reviews & Ratings", desc: "" },
		},

		notifications: {
			page: { title: "Notifications", desc: "" },
		},
		profile: {
			page: { title: "Profile", desc: "" },
		},

		builder: {
			page: { title: "Layout Builder", desc: "" },
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
