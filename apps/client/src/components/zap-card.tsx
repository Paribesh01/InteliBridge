"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Zap } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useDeleteZap } from "@/hooks/useDeleteZap";
import { useRouter } from "next/navigation";

interface ZapCardProps {
  zap: Zap;
}

export function ZapCard({ zap }: ZapCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteZap = useDeleteZap();
  const router = useRouter();

  // Format date to relative time
  const formattedDate = formatDistanceToNow(new Date(zap.createdAt), {
    addSuffix: true,
  });

  // Get the workflow count
  const workflowCount = zap.workflows?.length || 0;

  // Determine the status based on the trigger being set
  const status = zap.trigger?.set ? "Active" : "Inactive";

  const handleDelete = () => {
    deleteZap.mutate(zap.id);
  };

  // Add this function to handle card click
  const handleCardClick = () => {
    console.log("this is goiunh yo redirect", zap.id);
    router.push(`/zap/${zap.id}`);
  };

  return (
    <>
      <Card
        className="h-full transition-all hover:shadow-md cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle
              className="text-lg font-medium truncate"
              title={zap.name}
            >
              {zap.name}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{formattedDate}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* Trigger icon */}
              {zap.trigger?.type && (
                <div className="w-6 h-6 rounded-md overflow-hidden">
                  <img
                    src={zap.trigger.type.image}
                    alt={zap.trigger.type.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Show first workflow icon if it exists */}
              {workflowCount > 0 && zap.workflows[0]?.type && (
                <div className="w-6 h-6 rounded-md overflow-hidden">
                  <img
                    src={zap.workflows[0].type.image}
                    alt={zap.workflows[0].type.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Show more count if there are additional workflows */}
              {workflowCount > 1 && (
                <div className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 text-xs">
                  +{workflowCount - 1}
                </div>
              )}
            </div>

            <div
              className={`px-2 py-1 rounded-full text-xs ${
                status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {status}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the zap "{zap.name}" and all
              associated triggers and workflows. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
