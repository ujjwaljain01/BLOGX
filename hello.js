import { Client, Databases, Permission, Role } from 'node-appwrite';

const client = new Client()
	.setEndpoint('https://fra.cloud.appwrite.io/v1') // or your self-hosted endpoint
	.setProject('67f7da1500148a19408e')
	.setKey(
		'standard_53b7ccb3473184081cfb537117cdee624af1b4e223a5245d14b03a743845ff426a7ca68cb9eb8a23791900181f3f2dea330f530f3d81b3edf592154183f5c49cb32fce4ed07e91e31f0dc136e1d0e24e84ee4eb93e41e3be83de370eda218cd43b28bbf3f9457bf230020cc0e64772874936c80f9b384296bcc2554ba9631d89'
	); // the key you created

const databases = new Databases(client);

// Step 3: Set permissions for all registered users (CRUD)
(async () => {
	try {
		const collection = await databases.updateCollection(
			'67f7db62003751987f3c',
			'6914a57200163c1b5bfd',
			'Profile',
			[
				Permission.create(Role.any()), // all logged-in users can create
				Permission.read(Role.users()), // all logged-in users can read
				Permission.update(Role.users()), // all logged-in users can update
				Permission.delete(Role.users()), // all logged-in users can delete
			]
		);

		console.log('✅ Permissions updated successfully!');
		console.log(collection);
	} catch (err) {
		console.error('❌ Error updating permissions:', err);
	}
})();
