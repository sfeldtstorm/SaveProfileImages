/*
 * SaveProfileImages
 * Adds Save Avatar / Save Banner options to user context menus
 */

import { addContextMenuPatch, NavContextMenuPatchCallback, removeContextMenuPatch } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import { Menu } from "@webpack/common";
import { findByPropsLazy } from "@webpack";
import definePlugin, { OptionType } from "@utils/types";

// banner isn't always on the cached User object, profile store has it
const UserProfileStore = findByPropsLazy("getUserProfile", "getGuildMemberProfile");

const settings = definePluginSettings({
    imageSize: {
        type: OptionType.SELECT,
        description: "Resolution to download at",
        options: [
            { label: "128", value: 128 },
            { label: "256", value: 256 },
            { label: "512", value: 512 },
            { label: "1024", value: 1024 },
            { label: "2048", value: 2048 },
            { label: "4096 (max)", value: 4096, default: true },
        ],
    },
});

function buildAvatarUrl(user: any, size: number): string | null {
    if (!user?.avatar) return null;
    const ext = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${size}`;
}

function buildBannerUrl(user: any, size: number): string | null {
    const profile = UserProfileStore.getUserProfile(user.id);
    const bannerHash = profile?.banner ?? user?.banner;
    if (!bannerHash) return null;
    const ext = bannerHash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/banners/${user.id}/${bannerHash}.${ext}?size=${size}`;
}

async function downloadImage(url: string, filename: string) {
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (e) {
        console.error("[SaveProfileImages] Failed to download image:", e);
    }
}

function buildMenuItems(user: any) {
    const size = settings.store.imageSize;
    const avatarUrl = buildAvatarUrl(user, size);
    const bannerUrl = buildBannerUrl(user, size);

    if (!avatarUrl && !bannerUrl) return null;

    const items = [] as JSX.Element[];

    if (avatarUrl) {
        const ext = avatarUrl.endsWith(".gif") ? "gif" : "png";
        items.push(
            <Menu.MenuItem
                key="save-avatar"
                id="save-avatar"
                label="Save Avatar"
                action={() => downloadImage(avatarUrl, `${user.username}_avatar.${ext}`)}
            />
        );
    }

    if (bannerUrl) {
        const ext = bannerUrl.endsWith(".gif") ? "gif" : "png";
        items.push(
            <Menu.MenuItem
                key="save-banner"
                id="save-banner"
                label="Save Banner"
                action={() => downloadImage(bannerUrl, `${user.username}_banner.${ext}`)}
            />
        );
    }

    return (
        <Menu.MenuGroup key="save-profile-images">
            {items}
        </Menu.MenuGroup>
    );
}

// right click on a name/avatar anywhere
const userContextPatch: NavContextMenuPatchCallback = (children, { user }: { user: any; }) => {
    if (!user) return;
    const group = buildMenuItems(user);
    if (!group) return;
    children.push(group);
};

// right click inside an opened profile popout
const userProfilePatch: NavContextMenuPatchCallback = (children, { user }: { user: any; }) => {
    if (!user) return;
    const group = buildMenuItems(user);
    if (!group) return;
    children.push(group);
};

export default definePlugin({
    name: "SaveProfileImages",
    description: "Adds 'Save Avatar' / 'Save Banner' options to user context menus, downloading at full resolution.",
    authors: [{ name: "sfeldtstorm", id: 0n }],
    settings,

    start() {
        addContextMenuPatch("user-context", userContextPatch);
        addContextMenuPatch("user-profile-actions", userProfilePatch);
    },

    stop() {
        removeContextMenuPatch("user-context", userContextPatch);
        removeContextMenuPatch("user-profile-actions", userProfilePatch);
    },
});
