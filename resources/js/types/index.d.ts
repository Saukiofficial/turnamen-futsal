export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    status?: string;
    phone?: string;
    email_verified_at?: string;
}

export interface SharedEvent {
    id: number;
    name: string;
    code: string;
    slug: string;
    status: string;
    total_quota: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    allEvents?: SharedEvent[];
    defaultEvent?: SharedEvent | null;
};
