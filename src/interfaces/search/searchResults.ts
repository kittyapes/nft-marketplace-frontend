import type { DropApiReturnValue } from "../drops/dropApiReturnValue";
import type { UserData } from "../userData";

export interface SearchResults {
    collections: any[];
    users: UserData[];
    drops: DropApiReturnValue[];
}