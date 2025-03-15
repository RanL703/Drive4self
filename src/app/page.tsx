"use client"

import React, { useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { FileIcon, FileTextIcon, FolderIcon, ImageIcon, UploadIcon } from "lucide-react"

// Define types for our file system
type BaseItem = {
  type: string;
  name: string;
  createdAt: string;
  size: string | null;
}

type FolderItem = BaseItem & {
  type: "folder";
  children: string[];
}

type FileItem = BaseItem & {
  type: "file";
  extension: string;
}

type FileSystemItem = FolderItem | FileItem;

// Add id property for UI rendering
type ContentItem = FileSystemItem & {
  id: string;
}

// Define mock file system with type
const mockFileSystem: Record<string, FileSystemItem> = {
  root: {
    type: "folder",
    name: "My Drive",
    children: ["documents", "images", "projects"],
    createdAt: "2023-01-15",
    size: null,
  },
  documents: {
    type: "folder",
    name: "Documents",
    children: ["resume", "notes", "report"],
    createdAt: "2023-02-10",
    size: null,
  },
  images: {
    type: "folder",
    name: "Images",
    children: ["vacation", "profile"],
    createdAt: "2023-03-05",
    size: null,
  },
  projects: {
    type: "folder",
    name: "Projects",
    children: ["website", "app"],
    createdAt: "2023-04-20",
    size: null,
  },
  resume: {
    type: "file",
    name: "Resume.pdf",
    extension: "pdf",
    createdAt: "2023-02-15",
    size: "1.2 MB",
  },
  notes: {
    type: "file",
    name: "Meeting Notes.docx",
    extension: "docx",
    createdAt: "2023-02-28",
    size: "245 KB",
  },
  report: {
    type: "file",
    name: "Annual Report.xlsx",
    extension: "xlsx",
    createdAt: "2023-03-01",
    size: "3.5 MB",
  },
  vacation: {
    type: "file",
    name: "Beach.jpg",
    extension: "jpg",
    createdAt: "2023-03-10",
    size: "4.2 MB",
  },
  profile: {
    type: "file",
    name: "Profile Picture.png",
    extension: "png",
    createdAt: "2023-03-15",
    size: "1.8 MB",
  },
  website: {
    type: "file",
    name: "Website Design.fig",
    extension: "fig",
    createdAt: "2023-04-25",
    size: "8.7 MB",
  },
  app: {
    type: "file",
    name: "App Prototype.zip",
    extension: "zip",
    createdAt: "2023-05-02",
    size: "12.4 MB",
  },
}

// Helper function to get file icon based on extension
const getFileIcon = (extension: string) => {
  switch (extension) {
    case "jpg":
    case "png":
    case "gif":
      return <ImageIcon className="h-5 w-5" />
    case "pdf":
    case "docx":
    case "xlsx":
    case "txt":
      return <FileTextIcon className="h-5 w-5" />
    default:
      return <FileIcon className="h-5 w-5" />
  }
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export default function DriveClone() {
  const [currentPath, setCurrentPath] = useState<string[]>(["root"])

  // Get current folder
  const getCurrentFolder = (): FolderItem => {
    // Make sure we always have a valid current folder ID
    if (currentPath.length === 0) {
      // Default to root if path is empty
      const rootFolder = mockFileSystem.root as FolderItem;
      return rootFolder;
    }
    
    const currentFolderId = currentPath[currentPath.length - 1];
    
    // TypeScript type narrowing
    if (currentFolderId === undefined) {
      throw new Error("Current folder ID is undefined");
    }
    
    const folder = mockFileSystem[currentFolderId];
    
    if (!folder) {
      throw new Error(`Folder not found: ${currentFolderId}`);
    }
    
    if (folder.type !== "folder") {
      throw new Error(`Expected a folder but got: ${folder.type}`);
    }
    
    return folder;
  }

  // Get breadcrumb items
  const getBreadcrumbItems = () => {
    return currentPath.map((id, index) => {
      const item = mockFileSystem[id]
      
      if (!item) {
        throw new Error(`Item not found: ${id}`)
      }
      
      return {
        id,
        name: item.name,
        isLast: index === currentPath.length - 1,
      }
    })
  }

  // Get current folder contents
  const getCurrentContents = (): ContentItem[] => {
    const currentFolder = getCurrentFolder()
    
    if (!currentFolder.children || currentFolder.children.length === 0) {
      return []
    }

    return currentFolder.children.map((id) => {
      const item = mockFileSystem[id]
      
      if (!item) {
        throw new Error(`Item not found: ${id}`)
      }
      
      return {
        ...item,
        id,
      }
    })
  }

  // Handle folder click
  const handleItemClick = (item: ContentItem) => {
    if (item.type === "folder") {
      setCurrentPath([...currentPath, item.id])
    } else {
      // For files, we would typically open or download them
      // Here we'll just show an alert
      alert(`Opening file: ${item.name}`)
    }
  }

  // Handle breadcrumb click
  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  // Mock upload function
  const handleUpload = () => {
    alert("Upload functionality would be implemented here")
  }

  const breadcrumbItems = getBreadcrumbItems()
  const contents = getCurrentContents()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Drive</h1>
          <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>

        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <BreadcrumbItem>
                  {!item.isLast ? (
                    <BreadcrumbLink
                      onClick={() => handleBreadcrumbClick(index)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {item.name}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink className="text-gray-400 cursor-default">{item.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!item.isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-0">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 font-medium text-gray-400 border-b border-gray-800">
              <div className="w-8"></div>
              <div>Name</div>
              <div className="text-right">Size</div>
              <div className="w-32">Modified</div>
            </div>
            {contents.length > 0 ? (
              contents.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0"
                >
                  <div className="flex items-center justify-center w-8">
                    {item.type === "folder" ? (
                      <FolderIcon className="h-5 w-5 text-yellow-400" />
                    ) : (
                      getFileIcon((item as FileItem).extension)
                    )}
                  </div>
                  <div className="flex items-center">{item.name}</div>
                  <div className="text-right text-gray-400">{item.size ?? "--"}</div>
                  <div className="text-gray-400 w-32">{formatDate(item.createdAt)}</div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-400">This folder is empty</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

