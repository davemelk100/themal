export interface DiscogsRecord {
    url: string;
    name: string;
    type: "image" | "video";
}

export const discogsRecords: DiscogsRecord[] = [
    {
        url: "/uploads/discogs/1767296997498-121306134.jpeg",
        name: "Record 1",
        type: "image",
    },
    {
        url: "/uploads/discogs/1767297208790-600930205.jpeg",
        name: "Record 2",
        type: "image",
    },
    {
        url: "/uploads/discogs/1767297226582-272580072.mov",
        name: "Record 3",
        type: "video",
    },
    {
        url: "/uploads/discogs/1767297296858-697120943.mov",
        name: "Record 4",
        type: "video",
    },
];
