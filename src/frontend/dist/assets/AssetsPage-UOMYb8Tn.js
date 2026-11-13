import { c as createLucideIcon, i as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, l as Badge, Z as Zap, t as Package, v as useGetCreatorBalance, w as useGetAssets, x as useClaimRoyalties, B as Button, y as useApproveAsset, z as useRejectAsset, A as useSubmitAsset, C as ue } from "./index-Buftnbn6.js";
import { S as Skeleton } from "./skeleton-BuI67MZe.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-C7jHFuL9.js";
import { m as motion } from "./proxy-BprsZsqJ.js";
import { C as Coins } from "./index-qxoNb-CE.js";
import { S as Search } from "./search-BPo98NeZ.js";
import { C as Clock } from "./clock-BRktmbgP.js";
import { C as CircleCheckBig } from "./circle-check-big-DOLFaKUL.js";
import { C as CircleX } from "./circle-x-CIy-i3Z6.js";
import { M as Music } from "./music-BakrAysi.js";
import "./index-dHoi81eQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 13v8", key: "1l5pq0" }],
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "m8 17 4-4 4 4", key: "1quai1" }]
];
const CloudUpload = createLucideIcon("cloud-upload", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m16 18 6-6-6-6", key: "eg8j8" }],
  ["path", { d: "m8 6-6 6 6 6", key: "ppft3o" }]
];
const Code = createLucideIcon("code", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["circle", { cx: "10", cy: "12", r: "2", key: "737tya" }],
  ["path", { d: "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22", key: "wt3hpn" }]
];
const FileImage = createLucideIcon("file-image", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode);
function normalizeAsset(a) {
  return {
    id: a.id,
    creator: a.creator.toString(),
    name: a.name,
    description: a.description,
    tags: a.tags,
    assetType: a.assetType,
    fileCategory: a.fileCategory,
    storageUrl: a.storageUrl,
    codeContent: a.codeContent,
    status: a.status,
    submittedAt: a.submittedAt,
    approvedAt: a.approvedAt,
    royaltyBps: Number(a.royaltyBps),
    mintedAsNft: a.mintedAsNft,
    nftTokenId: a.nftTokenId
  };
}
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/object-storage/upload", {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Upload failed");
  const json = await res.json();
  return json.url ?? `/api/object-storage/asset/${json.assetId ?? ""}`;
}
const ACCEPTED_TYPES = {
  "model/gltf-binary": "glb",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/wave": "wav",
  "image/png": "texture",
  "image/jpeg": "image",
  "image/webp": "image"
};
const CATEGORY_ICONS = {
  glb: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4" }),
  mp3: /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "w-4 h-4" }),
  wav: /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "w-4 h-4" }),
  texture: /* @__PURE__ */ jsxRuntimeExports.jsx(FileImage, { className: "w-4 h-4" }),
  image: /* @__PURE__ */ jsxRuntimeExports.jsx(FileImage, { className: "w-4 h-4" }),
  svg: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "w-4 h-4" }),
  threejs: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "w-4 h-4" }),
  json: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" })
};
const CATEGORY_LABELS = {
  glb: "3D Model (GLB)",
  mp3: "Sound (MP3)",
  wav: "Sound (WAV)",
  texture: "Texture (PNG)",
  image: "Image",
  svg: "SVG Code",
  threejs: "Three.js Snippet",
  json: "JSON Definition"
};
function statusBadge(status) {
  if (status === "approved")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-accent/20 text-accent border-accent/40 text-[10px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
      " Approved"
    ] });
  if (status === "rejected")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-destructive/20 text-destructive border-destructive/40 text-[10px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
      " Rejected"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-primary/20 text-primary border-primary/40 text-[10px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
    " Pending"
  ] });
}
function AssetCard({
  asset,
  index,
  showActions,
  onApprove,
  onReject
}) {
  var _a;
  const royaltyPct = (asset.royaltyBps / 100).toFixed(1);
  const isCode = asset.assetType === "code";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.05 },
      "data-ocid": `assets.browse.item.${index + 1}`,
      className: "arcade-card flex flex-col gap-3 hover:border-accent/40 transition-smooth",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-32 rounded-md bg-muted/30 border border-border flex items-center justify-center overflow-hidden", children: asset.assetType === "file" && asset.storageUrl ? asset.fileCategory === "image" || asset.fileCategory === "texture" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: asset.storageUrl,
            alt: asset.name,
            className: "w-full h-full object-cover"
          }
        ) : asset.fileCategory === "mp3" || asset.fileCategory === "wav" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "w-8 h-8 text-accent opacity-70" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Audio Asset" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-8 h-8 text-primary opacity-70" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "3D Model" })
        ] }) : isCode ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-background/60 flex items-center justify-center p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[10px] text-accent/80 font-mono line-clamp-5 text-left w-full overflow-hidden", children: ((_a = asset.codeContent) == null ? void 0 : _a.slice(0, 200)) ?? "" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground", children: [
          CATEGORY_ICONS[asset.fileCategory],
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: CATEGORY_LABELS[asset.fileCategory] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground truncate", children: asset.name }),
            statusBadge(asset.status)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: asset.description || "No description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] border-border gap-1", children: [
              CATEGORY_ICONS[asset.fileCategory],
              CATEGORY_LABELS[asset.fileCategory]
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-[10px] border-accent/30 text-accent gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
                  royaltyPct,
                  "% royalty"
                ]
              }
            ),
            asset.mintedAsNft && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-[10px] border-primary/40 text-primary",
                children: "ICRC-7 NFT"
              }
            )
          ] }),
          asset.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: asset.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground",
              children: [
                "#",
                tag
              ]
            },
            tag
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: showActions && asset.status === "pending" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "flex-1 bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30 text-xs",
              onClick: () => onApprove == null ? void 0 : onApprove(asset.id),
              "data-ocid": `assets.approve.button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3 mr-1" }),
                "Approve"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 text-xs",
              onClick: () => onReject == null ? void 0 : onReject(asset.id),
              "data-ocid": `assets.reject.button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3 mr-1" }),
                "Reject"
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "flex-1 border-primary/40 text-primary hover:bg-primary/10 text-xs",
            "data-ocid": `assets.use_in_table.button.${index + 1}`,
            onClick: () => ue.info("Open Table Constructor to use this asset"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3 mr-1" }),
              "Use in Table"
            ]
          }
        ) })
      ]
    }
  );
}
function BrowseTab({ isLoggedIn }) {
  const [search, setSearch] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const { data: rawAssets = [], isLoading } = useGetAssets("approved");
  const assets = rawAssets.map(normalizeAsset);
  const approveAsset = useApproveAsset();
  const rejectAsset = useRejectAsset();
  const { data: rawPendingAssets = [] } = useGetAssets("pending");
  const pendingAssets = rawPendingAssets.map(normalizeAsset);
  const filtered = assets.filter((a) => {
    const matchesType = typeFilter === "all" || a.assetType === typeFilter;
    const matchesSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });
  const handleApprove = async (id) => {
    try {
      await approveAsset.mutateAsync(id);
      ue.success("Asset approved");
    } catch {
      ue.error("Failed to approve asset");
    }
  };
  const handleReject = async (id) => {
    try {
      await rejectAsset.mutateAsync(id);
      ue.success("Asset rejected");
    } catch {
      ue.error("Failed to reject asset");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search assets by name, tag…",
            "data-ocid": "assets.browse.search_input",
            className: "w-full pl-9 pr-4 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-md border border-border overflow-hidden", children: ["all", "file", "code"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setTypeFilter(f),
          "data-ocid": `assets.browse.filter.${f}`,
          className: `px-4 py-2 text-sm font-medium capitalize transition-colors ${typeFilter === f ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`,
          children: f
        },
        f
      )) })
    ] }),
    isLoggedIn && pendingAssets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "space-y-3 p-4 rounded-xl border border-primary/30 bg-primary/5",
        "data-ocid": "assets.dao_queue.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-sm text-primary flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
            "DAO Approval Queue (",
            pendingAssets.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Review and vote on community-submitted assets awaiting DAO approval." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: pendingAssets.map((asset, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            AssetCard,
            {
              asset,
              index: i,
              showActions: true,
              onApprove: handleApprove,
              onReject: handleReject
            },
            asset.id
          )) })
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-lg" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 gap-4",
        "data-ocid": "assets.browse.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-12 h-12 text-muted-foreground opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground mb-1", children: "No assets found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: search ? "Try a different search term or filter" : "Be the first to submit an asset to the marketplace!" })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: filtered.map((asset, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(AssetCard, { asset, index: i }, asset.id)) })
  ] });
}
function UploadFilesTab() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const submitAsset = useSubmitAsset();
  const [dragging, setDragging] = reactExports.useState(false);
  const [file, setFile] = reactExports.useState(null);
  const [previewUrl, setPreviewUrl] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState("");
  const [royaltyBps, setRoyaltyBps] = reactExports.useState(250);
  const [mintNft, setMintNft] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const [nameError, setNameError] = reactExports.useState("");
  const fileInputRef = reactExports.useRef(null);
  const detectedCategory = file ? ACCEPTED_TYPES[file.type] ?? null : null;
  const handleFileDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) processFile(dropped);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  function processFile(f) {
    const cat = ACCEPTED_TYPES[f.type];
    if (!cat) {
      ue.error("Unsupported file type. Use GLB, MP3, WAV, PNG, JPG, WEBP.");
      return;
    }
    if (f.size > 4 * 1024 * 1024) {
      ue.warning("File is larger than 4MB — consider optimizing it first.");
    } else if (f.size > 1.5 * 1024 * 1024) {
      ue.warning(
        "File is over 1.5MB. Upload may be slow; consider compressing."
      );
    }
    setFile(f);
    if (cat === "image" || cat === "texture") {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
    if (!name) setName(f.name.replace(/\.[^.]+$/, ""));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Asset name is required");
      return;
    }
    if (!file || !detectedCategory) {
      ue.error("Please select a file to upload");
      return;
    }
    setUploading(true);
    try {
      const storageUrl = await uploadFile(file);
      await submitAsset.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        assetType: "file",
        fileCategory: detectedCategory,
        storageUrl,
        codeContent: void 0,
        royaltyBps,
        mintedAsNft: mintNft
      });
      ue.success("Asset submitted for DAO review!");
      setFile(null);
      setPreviewUrl(null);
      setName("");
      setDescription("");
      setTags("");
      setRoyaltyBps(250);
      setMintNft(false);
    } catch {
      ue.error("Submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 gap-4",
        "data-ocid": "assets.upload.login_required",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "w-12 h-12 text-muted-foreground opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center", children: "Login with Internet Identity to upload assets." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onDragOver: (e) => {
          e.preventDefault();
          setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop: handleFileDrop,
        onClick: () => {
          var _a;
          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
        },
        "aria-label": "Upload file drop zone",
        "data-ocid": "assets.upload.dropzone",
        className: `relative w-full min-h-[180px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-smooth ${dragging ? "border-accent/70 bg-accent/10" : file ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/20"}`,
        children: [
          file ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 p-4 text-center", children: [
            previewUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: previewUrl,
                alt: "Preview",
                className: "max-h-24 max-w-full rounded-lg object-contain"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: detectedCategory === "glb" ? "📦" : detectedCategory === "mp3" || detectedCategory === "wav" ? "🎵" : "📄" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground", children: file.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              (file.size / 1024).toFixed(0),
              " KB ·",
              " ",
              detectedCategory ? CATEGORY_LABELS[detectedCategory] : "Unknown"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent", children: "Click to change file" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CloudUpload,
              {
                className: `w-10 h-10 ${dragging ? "text-accent" : "text-muted-foreground"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: "Drop file here or click to browse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "GLB (3D), MP3/WAV (audio), PNG/JPG/WEBP (textures)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Recommended max: 1.5MB · Absolute max: 4MB" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              className: "hidden",
              accept: ".glb,.mp3,.wav,.png,.jpg,.jpeg,.webp",
              onChange: (e) => {
                var _a;
                const f = (_a = e.target.files) == null ? void 0 : _a[0];
                if (f) processFile(f);
              },
              "data-ocid": "assets.upload.upload_button"
            }
          )
        ]
      }
    ),
    file && (detectedCategory === "mp3" || detectedCategory === "wav") && // biome-ignore lint/a11y/useMediaCaption: user's own uploaded audio file
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "audio",
      {
        controls: true,
        src: URL.createObjectURL(file),
        className: "w-full",
        "data-ocid": "assets.upload.audio_preview"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "asset-name",
            className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
            children: [
              "Asset Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "asset-name",
            type: "text",
            value: name,
            onChange: (e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            },
            onBlur: () => !name.trim() && setNameError("Name is required"),
            placeholder: "Neon Ramp Pack",
            "data-ocid": "assets.upload.name.input",
            className: `w-full px-3 py-2 rounded-md bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground ${nameError ? "border-destructive" : "border-input"}`
          }
        ),
        nameError && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "assets.upload.name.field_error",
            children: nameError
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "asset-desc",
            className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
            children: "Description"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "asset-desc",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            rows: 3,
            maxLength: 400,
            placeholder: "Describe your asset — what it looks/sounds like, what tables it suits…",
            "data-ocid": "assets.upload.description.textarea",
            className: "w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground resize-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "asset-tags",
            className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
            children: [
              "Tags",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case tracking-normal font-normal text-muted-foreground", children: "(comma-separated)" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "asset-tags",
            type: "text",
            value: tags,
            onChange: (e) => setTags(e.target.value),
            placeholder: "neon, cyberpunk, ramp, loop",
            "data-ocid": "assets.upload.tags.input",
            className: "w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "royalty-slider",
              className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
              children: "Royalty Rate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm text-accent font-bold", children: [
            (royaltyBps / 100).toFixed(1),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "royalty-slider",
            type: "range",
            min: 0,
            max: 1e3,
            step: 25,
            value: royaltyBps,
            onChange: (e) => setRoyaltyBps(Number(e.target.value)),
            "data-ocid": "assets.upload.royalty.input",
            className: "w-full accent-accent"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "You earn this % of ICFC each time a table using your asset is played." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Mint as ICRC-7 NFT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Tokenize your asset on the Internet Computer (stub — DAO must enable)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": mintNft,
            onClick: () => setMintNft((v) => !v),
            "data-ocid": "assets.upload.mint_nft.switch",
            className: `relative w-11 h-6 rounded-full border-2 transition-colors ${mintNft ? "bg-primary/80 border-primary" : "bg-muted border-border"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `block w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-all ${mintNft ? "left-[22px]" : "left-0.5"}`
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "submit",
        disabled: uploading || submitAsset.isPending,
        className: "w-full border border-primary/60 text-primary bg-primary/10 hover:bg-primary/20 font-semibold",
        style: { boxShadow: "0 0 12px oklch(var(--primary)/0.25)" },
        "data-ocid": "assets.upload.submit_button",
        children: uploading || submitAsset.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" }),
          "Uploading…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "w-4 h-4" }),
          "Submit for DAO Review"
        ] })
      }
    )
  ] });
}
function SubmitCodeTab() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const submitAsset = useSubmitAsset();
  const [codeContent, setCodeContent] = reactExports.useState("");
  const [language, setLanguage] = reactExports.useState("svg");
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState("");
  const [royaltyBps, setRoyaltyBps] = reactExports.useState(250);
  const [mintNft, setMintNft] = reactExports.useState(false);
  const [nameError, setNameError] = reactExports.useState("");
  const previewRef = reactExports.useRef(null);
  const langToCategory = {
    svg: "svg",
    threejs: "threejs",
    json: "json"
  };
  const svgPreview = language === "svg" && codeContent.trim().startsWith("<") ? codeContent : null;
  const jsonPreview = language === "json" ? (() => {
    try {
      return JSON.stringify(JSON.parse(codeContent), null, 2);
    } catch {
      return null;
    }
  })() : null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Asset name is required");
      return;
    }
    if (!codeContent.trim()) {
      ue.error("Code content cannot be empty");
      return;
    }
    try {
      await submitAsset.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        assetType: "code",
        fileCategory: langToCategory[language],
        storageUrl: void 0,
        codeContent: codeContent.trim(),
        royaltyBps,
        mintedAsNft: mintNft
      });
      ue.success("Code asset submitted for DAO review!");
      setCodeContent("");
      setName("");
      setDescription("");
      setTags("");
    } catch {
      ue.error("Submission failed. Please try again.");
    }
  };
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 gap-4",
        "data-ocid": "assets.code.login_required",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "w-12 h-12 text-muted-foreground opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center", children: "Login with Internet Identity to submit code assets." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Language:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-md border border-border overflow-hidden", children: ["svg", "threejs", "json"].map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setLanguage(lang),
          "data-ocid": `assets.code.language.${lang}`,
          className: `px-3 py-1.5 text-xs font-mono font-semibold capitalize transition-colors ${language === lang ? "bg-accent/20 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`,
          children: lang === "threejs" ? "Three.js" : lang.toUpperCase()
        },
        lang
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "code-editor",
            className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
            children: language === "svg" ? "SVG Code" : language === "threejs" ? "Three.js Snippet" : "JSON Definition"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "code-editor",
            value: codeContent,
            onChange: (e) => setCodeContent(e.target.value),
            placeholder: language === "svg" ? '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="50" cy="50" r="40" fill="none" stroke="cyan" stroke-width="3"/>\n</svg>' : language === "threejs" ? "// Custom Three.js bumper geometry\nconst geo = new THREE.TorusGeometry(0.5, 0.15, 8, 24);\nconst mat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x004444 });\nreturn new THREE.Mesh(geo, mat);" : '{\n  "type": "bumper",\n  "radius": 0.5,\n  "points": 100,\n  "color": "#00ffff"\n}',
            rows: 16,
            "data-ocid": "assets.code.editor",
            spellCheck: false,
            className: "w-full px-3 py-3 rounded-md bg-background border border-input text-xs font-mono focus:outline-none focus:ring-2 focus:ring-accent/40 text-foreground placeholder:text-muted-foreground resize-none leading-relaxed"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Live Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: previewRef,
            className: "w-full h-[calc(16*1.625rem)] rounded-md bg-background/60 border border-border flex items-center justify-center overflow-hidden p-4",
            "data-ocid": "assets.code.preview",
            children: svgPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-full h-full flex items-center justify-center",
                dangerouslySetInnerHTML: { __html: svgPreview }
              }
            ) : jsonPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[10px] font-mono text-accent/80 text-left w-full overflow-auto max-h-full", children: jsonPreview }) : codeContent.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "w-8 h-8 opacity-40 mx-auto mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: language === "threejs" ? "Three.js preview renders at runtime" : "Preview not available" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "w-8 h-8 opacity-40 mx-auto mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "Write code to see a preview" })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "code-name",
            className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
            children: [
              "Asset Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "code-name",
            type: "text",
            value: name,
            onChange: (e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            },
            onBlur: () => !name.trim() && setNameError("Name is required"),
            placeholder: "Neon Bumper SVG",
            "data-ocid": "assets.code.name.input",
            className: `w-full px-3 py-2 rounded-md bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground ${nameError ? "border-destructive" : "border-input"}`
          }
        ),
        nameError && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "assets.code.name.field_error",
            children: nameError
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "code-tags",
            className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
            children: "Tags (comma-separated)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "code-tags",
            type: "text",
            value: tags,
            onChange: (e) => setTags(e.target.value),
            placeholder: "neon, bumper, svg",
            "data-ocid": "assets.code.tags.input",
            className: "w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: "code-desc",
          className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
          children: "Description"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          id: "code-desc",
          value: description,
          onChange: (e) => setDescription(e.target.value),
          rows: 2,
          maxLength: 400,
          placeholder: "Describe what this code does and how to use it…",
          "data-ocid": "assets.code.description.textarea",
          className: "w-full px-3 py-2 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground resize-none"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4 items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "code-royalty",
              className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
              children: "Royalty Rate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm text-accent font-bold", children: [
            (royaltyBps / 100).toFixed(1),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "code-royalty",
            type: "range",
            min: 0,
            max: 1e3,
            step: 25,
            value: royaltyBps,
            onChange: (e) => setRoyaltyBps(Number(e.target.value)),
            "data-ocid": "assets.code.royalty.input",
            className: "w-full accent-accent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Mint as ICRC-7 NFT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Tokenize this code asset" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": mintNft,
            onClick: () => setMintNft((v) => !v),
            "data-ocid": "assets.code.mint_nft.switch",
            className: `relative w-11 h-6 rounded-full border-2 transition-colors ${mintNft ? "bg-primary/80 border-primary" : "bg-muted border-border"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `block w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-all ${mintNft ? "left-[22px]" : "left-0.5"}`
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "submit",
        disabled: submitAsset.isPending,
        className: "w-full border border-accent/60 text-accent bg-accent/10 hover:bg-accent/20 font-semibold",
        style: { boxShadow: "0 0 12px oklch(var(--accent)/0.25)" },
        "data-ocid": "assets.code.submit_button",
        children: submitAsset.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin" }),
          "Submitting…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "w-4 h-4" }),
          "Submit Code for DAO Review"
        ] })
      }
    )
  ] });
}
function CreatorDashboard() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const { data: balance } = useGetCreatorBalance();
  const { data: rawAllAssets = [] } = useGetAssets("all");
  const callerPrincipal = identity == null ? void 0 : identity.getPrincipal().toText();
  const myAssets = rawAllAssets.map(normalizeAsset).filter((a) => a.creator === callerPrincipal);
  const claimRoyalties = useClaimRoyalties();
  if (!isLoggedIn) return null;
  const claimable = (balance == null ? void 0 : balance.claimable) ?? BigInt(0);
  const totalEarned = (balance == null ? void 0 : balance.totalEarned) ?? BigInt(0);
  const handleClaim = async () => {
    if (claimable === BigInt(0)) {
      ue.info("Nothing to claim yet");
      return;
    }
    try {
      await claimRoyalties.mutateAsync();
      ue.success("Royalties claimed! ICFC sent to your wallet.");
    } catch {
      ue.error("Claim failed. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      className: "space-y-4 p-5 rounded-xl border border-accent/30 bg-accent/5",
      "data-ocid": "assets.creator_dashboard.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-accent flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-5 h-5" }),
            "Creator Dashboard"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: handleClaim,
              disabled: claimRoyalties.isPending || claimable === BigInt(0),
              className: "border border-accent/50 text-accent bg-accent/10 hover:bg-accent/20 text-xs",
              style: { boxShadow: "0 0 12px oklch(var(--accent)/0.2)" },
              "data-ocid": "assets.creator_dashboard.claim_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 mr-1" }),
                claimRoyalties.isPending ? "Claiming…" : `Claim ${Number(claimable).toLocaleString()} ICFC`
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "arcade-card text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xl font-bold text-accent", children: Number(totalEarned).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mt-1", children: "Total Earned (ICFC)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "arcade-card text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xl font-bold text-primary", children: Number(claimable).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mt-1", children: "Claimable Now" })
          ] })
        ] }),
        myAssets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
            "My Submissions (",
            myAssets.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: myAssets.map((asset, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `assets.my_assets.item.${i + 1}`,
              className: "flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm truncate", children: asset.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    CATEGORY_LABELS[asset.fileCategory],
                    " ·",
                    " ",
                    (asset.royaltyBps / 100).toFixed(1),
                    "% royalty"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-3", children: statusBadge(asset.status) })
              ]
            },
            asset.id
          )) })
        ] })
      ]
    }
  );
}
function AssetsPage() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const [tab, setTab] = reactExports.useState("browse");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-card border-b border-border/40",
        "data-ocid": "assets.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -12 },
            animate: { opacity: 1, y: 0 },
            className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "font-display text-3xl sm:text-4xl font-bold neon-text-accent",
                    style: {
                      textShadow: "0 0 20px oklch(var(--accent)/0.7), 0 0 40px oklch(var(--accent)/0.4)"
                    },
                    children: "Asset Marketplace"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm max-w-lg", children: "Upload GLB models, sounds, textures, and code assets. Earn ICFC royalties every time your asset powers a pinball table." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "border-accent/40 text-accent gap-1 text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
                      "ICFC Royalties"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "border-primary/40 text-primary gap-1 text-xs",
                    children: "DAO Governed"
                  }
                )
              ] })
            ]
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreatorDashboard, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: setTab, "data-ocid": "assets.tabs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-muted/40 border border-border mb-6 flex overflow-x-auto w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "browse",
              "data-ocid": "assets.browse.tab",
              className: "gap-1.5 flex-shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4" }),
                "Browse"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "upload",
              "data-ocid": "assets.upload.tab",
              className: "gap-1.5 flex-shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "w-4 h-4" }),
                "Upload Files"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "code",
              "data-ocid": "assets.code.tab",
              className: "gap-1.5 flex-shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "w-4 h-4" }),
                "Submit Code"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "browse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowseTab, { isLoggedIn }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "upload", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UploadFilesTab, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "code", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitCodeTab, {}) })
      ] })
    ] })
  ] });
}
export {
  AssetsPage as default
};
