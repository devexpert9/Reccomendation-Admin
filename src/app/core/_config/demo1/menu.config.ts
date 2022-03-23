export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [],
		},
		aside: {
			self: {},
			items: [
				{
					title: "Users",
					bullet: "dot",
					page: "users",
					icon: "flaticon2-user-1",
				},
				{
					title: "Notifications",
					bullet: "dot",
					page: "notifications",
					icon: "flaticon2-bell",
				},

				{
					title: "Profile",
					bullet: "dot",
					page: "profile",
					icon: "flaticon2-user-1",
				},
				{
					title: "Posts",
					bullet: "dot",
					page: "posts",
					icon: "flaticon2-document",
				},
				{
					title: "Categories",
					bullet: "dot",
					page: "categories",
					icon: "flaticon2-document",
				},
				{
					title: "Feedbacks",
					bullet: "dot",
					page: "feedback",
					icon: "flaticon2-document",
				},
			],
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
