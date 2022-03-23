// Angular
// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// Components
import { BaseComponent } from "./base/base.component";
import { ErrorPageComponent } from "./content/error-page/error-page.component";
// Auth
import { AuthGuard } from "../../../core/auth";

const routes: Routes = [
	{
		path: "",
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: "users",
				loadChildren: () =>
					import("../../../views/pages/users/users.module").then(
						(m) => m.UsersModule
					),
			},
			{
				path: "profile",
				loadChildren: () =>
					import("../../../views/pages/profile/profile.module").then(
						(m) => m.ProfileModule
					),
			},
			{
				path: "posts",
				loadChildren: () =>
					import("../../../views/pages/posts/posts.module").then(
						(m) => m.PostsModule
					),
			},
			{
				path: "categories",
				loadChildren: () =>
					import(
						"../../../views/pages/category/category.module"
					).then((m) => m.CategoryModule),
			},
			{
				path: "feedback",
				loadChildren: () =>
					import(
						"../../../views/pages/feedback/feedback.module"
					).then((m) => m.FeedbackModule),
			},
			{
				path: "following/:id",
				loadChildren: () =>
					import(
						"../../../views/pages/following/following.module"
					).then((m) => m.FollowingModule),
			},
			{
				path: "notifications",
				loadChildren: () =>
					import(
						"../../../views/pages/notifications/notifications.module"
					).then((m) => m.NotificationsModule),
			},
			{
				path: "builder",
				loadChildren: () =>
					import(
						"../../../views/themes/demo1/content/builder/builder.module"
					).then((m) => m.BuilderModule),
			},
			{
				path: "error/403",
				component: ErrorPageComponent,
				data: {
					type: "error-v6",
					code: 403,
					title: "403... Access forbidden",
					desc: "Looks like you don't have permission to access for requested page.<br> Please, contact administrator",
				},
			},
			{ path: "error/:type", component: ErrorPageComponent },
			{ path: "", redirectTo: "users", pathMatch: "full" },
			{ path: "**", redirectTo: "users", pathMatch: "full" },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule {}
