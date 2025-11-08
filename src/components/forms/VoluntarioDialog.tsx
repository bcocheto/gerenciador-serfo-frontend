import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VoluntarioForm } from "./VoluntarioForm";
import { Voluntario } from "@/services/voluntarioService";

interface VoluntarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voluntario?: Voluntario;
  isEdit?: boolean;
}

export function VoluntarioDialog({ open, onOpenChange, voluntario, isEdit = false }: VoluntarioDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Voluntário" : "Novo Voluntário"}
          </DialogTitle>
        </DialogHeader>

        <VoluntarioForm
          voluntario={voluntario}
          isEdit={isEdit}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}