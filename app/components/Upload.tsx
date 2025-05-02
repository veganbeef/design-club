"use client";

import { useState, useCallback } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Icon } from "./Icon";
import Image from "next/image";

type TabProps = {
  setActiveTab: (tab: string) => void;
};

export function Upload({ setActiveTab }: TabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile || !title) return;

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would:
      // 1. Upload the file to a storage service
      // 2. Create a record in your database
      // 3. Handle any errors appropriately
      
      setIsSuccess(true);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, title]);

  if (isSuccess) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card title="Upload Successful">
          <div className="text-center space-y-4 py-6">
            <Icon name="check" className="text-green-500 mx-auto" size="lg" />
            <h3 className="text-xl font-semibold">Design Submitted!</h3>
            <p className="text-[var(--app-foreground-muted)]">
              Your design has been successfully submitted and is pending review.
            </p>
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={() => setActiveTab("designs")}
              >
                View Designs
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Submit Design">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--app-foreground)]">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--app-card-border)] rounded-md bg-[var(--app-card-bg)] text-[var(--app-foreground)]"
              placeholder="Enter design title"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--app-foreground)]">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--app-card-border)] rounded-md bg-[var(--app-card-bg)] text-[var(--app-foreground)]"
              placeholder="Enter design caption"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--app-foreground)]">
              Design Image
            </label>
            <div className="border-2 border-dashed border-[var(--app-card-border)] rounded-lg p-6 text-center">
              {previewUrl ? (
                <div className="relative w-full aspect-video mb-4">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="py-8">
                  <Icon name="upload" className="mx-auto mb-2 text-[var(--app-foreground-muted)]" />
                  <p className="text-sm text-[var(--app-foreground-muted)]">
                    Drag and drop your design here, or click to select
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-[var(--app-accent)] text-white rounded-md cursor-pointer hover:opacity-90"
              >
                Select File
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setActiveTab("designs")}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!selectedFile || !title || isUploading}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Uploading...
                </span>
              ) : (
                "Submit Design"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
