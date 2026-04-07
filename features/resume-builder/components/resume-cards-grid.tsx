"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Loader2, MoreVertical, FileText, Trash2, Download, LayoutTemplate } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { createGeneralResumeAction, deleteResumeAction } from "@/features/resume-builder/actions/resume-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function ResumeCardsGrid({ initialData = [] }: { initialData: any[] }) {
  const t = useTranslations("ResumeBuilder");
  const router = useRouter();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCreatingGeneral, setIsCreatingGeneral] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Resume deletion handlers
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmationText("");
  };

  const closeDeleteDialog = () => {
    setDeletingId(null);
    setDeleteConfirmationText("");
    setIsDeleting(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteResumeAction(deletingId);
      toast.success(t("ResumeDeletedSuccess") || "Resume deleted successfully");
      closeDeleteDialog();
      router.refresh(); // Ensure the layout explicitly refreshes
    } catch (err: any) {
      toast.error(err.message || "Failed to delete resume");
      setIsDeleting(false);
    }
  };

  const handleCreateGeneral = async () => {
      setIsCreatingGeneral(true);
      try {
          const resume = await createGeneralResumeAction("General Resume");
          router.push(`/dashboard/resume-builder/${resume.resume_id}`);
      } catch (err: any) {
          toast.error(err.message || "Failed to create resume");
      } finally {
          setIsCreatingGeneral(false);
      }
  };

  // Filter or manage resumes
  const resumes = initialData;
  const isAtLimit = resumes.length >= 3;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-black tracking-tight">{t("MyResumes")}</h1>
           <p className="text-sm text-muted-foreground mt-1">{t("ManageResumesDesc")}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            disabled={isAtLimit || isCreatingGeneral}
            onClick={isAtLimit ? undefined : handleCreateGeneral}
            className="shadow-sm"
          >
             {isAtLimit ? (
                 <span title={t("LimitReachedTooltip")} className="flex items-center">
                     <Plus className="w-4 h-4 mr-2" />
                     {t("GeneralResume")}
                 </span>
             ) : (
                 <span className="flex items-center">
                    {isCreatingGeneral ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    {t("GeneralResume")}
                 </span>
             )}
          </Button>

          <Button 
            disabled={isAtLimit}
            onClick={() => toast.info(t("CreateGeneralFirst", { fallback: "Create a General Resume first, then Personalize it from the Editor." }))}
            className="shadow-sm"
          >
            <Target className="w-4 h-4 mr-2" />
            {t("JobBasedResume")}
          </Button>
        </div>
      </div>

      {resumes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="border-dashed bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group" onClick={handleCreateGeneral}>
                  <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <LayoutTemplate className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{t("GeneralDescriptionTitle")}</h3>
                      <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">{t("GeneralDescription")}</p>
                      <Button variant="secondary" className="mt-6 pointer-events-none" disabled={isCreatingGeneral}>
                          {isCreatingGeneral && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          {t("CreateGeneral")}
                      </Button>
                  </CardContent>
              </Card>

              <Card className="border-dashed bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => toast.info(t("CreateGeneralFirst", { fallback: "Create a General Resume first, then Personalize it from the Editor." }))}>
                  <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <Target className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{t("JobBasedDescriptionTitle")}</h3>
                      <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">{t("JobBasedDescription")}</p>
                      <Button className="mt-6 pointer-events-none">{t("CreateJobBased")}</Button>
                  </CardContent>
              </Card>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {resumes.map(resume => (
                  <Card key={resume.resume_id} className="relative group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                      
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                          {resume.resume_type === 'job_based' && (
                              <Badge variant="secondary" className="flex items-center px-2 py-0.5 space-x-1 shadow-sm backdrop-blur bg-background/80">
                                  <Target className="w-3 h-3 mr-1" />
                                  <span className="text-[10px] uppercase font-bold tracking-wider">{t("JobBased")}</span>
                              </Badge>
                          )}
                          
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="secondary" size="icon" className="h-7 w-7 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur shadow-sm hover:bg-background">
                                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem asChild>
                                      <a href={`/api/resume/${resume.resume_id}/export`} download className="flex items-center cursor-pointer">
                                          <Download className="w-4 h-4 mr-2 text-muted-foreground" />
                                          <span>{t("Download")}</span>
                                      </a>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                      className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                                      onClick={() => openDeleteDialog(resume.resume_id)}
                                  >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      <span>{t("Delete")}</span>
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </div>

                      <div className="bg-gradient-to-br from-muted to-muted/30 h-[180px] w-full flex items-center justify-center overflow-hidden border-b relative">
                          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                          
                          <div className="bg-white shadow-sm border border-black/5 rounded-sm w-[110px] h-[155px] p-2 relative z-10 group-hover:-translate-y-1 transition-transform duration-500 ease-out flex flex-col gap-1.5">
                              {/* Fake Resume Skeleton */}
                              <div className="w-1/2 h-2 bg-muted-foreground/20 rounded-full mx-auto mt-2"></div>
                              <div className="w-3/4 h-1.5 bg-muted-foreground/10 rounded-full mx-auto mb-2"></div>
                              <div className="w-full h-1 bg-muted-foreground/10 rounded-full"></div>
                              <div className="w-full h-1 bg-muted-foreground/10 rounded-full"></div>
                              <div className="w-5/6 h-1 bg-muted-foreground/10 rounded-full"></div>
                              <div className="w-full h-1 bg-muted-foreground/10 rounded-full mt-1"></div>
                              <div className="w-4/5 h-1 bg-muted-foreground/10 rounded-full"></div>
                          </div>
                      </div>

                      <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base truncate" title={resume.title || t("UntitledResume")}>
                              {resume.title || t("UntitledResume")}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-2 text-xs font-medium">
                              <Badge variant={resume.ats_score && resume.ats_score > 75 ? "default" : "secondary"} className="h-5 px-1.5 text-[10px] rounded-sm">
                                  ATS: {resume.ats_score !== null ? `${resume.ats_score}` : "—"}
                              </Badge>
                              <span className="text-muted-foreground/40">•</span>
                              <span className="text-muted-foreground" suppressHydrationWarning>{new Date(resume.last_updated_at).toLocaleDateString()}</span>
                          </CardDescription>
                      </CardHeader>

                      <CardFooter className="p-4 pt-2">
                           <Button asChild className="w-full transition-all" variant="default">
                               <Link href={`/dashboard/resume-builder/${resume.resume_id}`}>
                                  <FileText className="w-3.5 h-3.5 mr-2" />
                                  {t("EditResume")}
                               </Link>
                           </Button>
                      </CardFooter>
                  </Card>
              ))}
          </div>
      )}


      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && closeDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("DeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3" asChild>
              <div>
                <p>
                  {t("DeleteDescription1")}
                </p>
                <p className="text-foreground font-medium">
                  {t("DeleteDescription2")} <span className="font-bold text-red-600">Delete</span> {t("DeleteDescription3")}
                </p>
                <Input 
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder={t("TypeDeleteToConfirm")}
                  disabled={isDeleting}
                  className="mt-2"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={deleteConfirmationText !== 'Delete' || isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              {t("DeleteResume")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
