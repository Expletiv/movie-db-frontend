export class UserProfile {

  email: string;
  name: string;
  oid: string;  // unique identifier
  preferredUsername: string;
  roles: string[];


  private constructor(email: string, name: string, oid: string, preferredUsername: string, roles: string[]) {
    this.email = email;
    this.name = name;
    this.oid = oid;
    this.preferredUsername = preferredUsername;
    this.roles = roles;
  }

  public static fromClaims(claims: Record<string, any>) {
    return new UserProfile(
      claims['email'],
      claims['name'],
      claims['oid'],
      claims['preferred_username'],
      claims['roles']
    )
  }

}
