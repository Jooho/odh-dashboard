import * as React from 'react';
import * as _ from 'lodash';
import { getPvcs } from '../../../../../api';
import { PersistentVolumeClaimKind } from '../../../../../k8sTypes';
import { NotebookState } from '../../../notebook/types';
import { getNotebookPVCNames } from '../../../pvc/utils';

const useAvailablePvcs = (
  projectName: string,
  notebooks: NotebookState[],
): [pvcs: PersistentVolumeClaimKind[], loaded: boolean, loadError: Error | undefined] => {
  const [pvcs, setPvcs] = React.useState<PersistentVolumeClaimKind[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [loadError, setLoadError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    if (projectName) {
      getPvcs(projectName)
        .then((newPvcs) => {
          const usedPvcs = _.uniq(
            notebooks.flatMap((notebook) => getNotebookPVCNames(notebook.notebook)),
          );
          setPvcs(newPvcs.filter((pvc) => !usedPvcs.includes(pvc.metadata.name)));
          setLoaded(true);
        })
        .catch((e) => {
          setLoadError(e);
          setLoaded(true);
        });
    }
  }, [projectName, notebooks]);

  return [pvcs, loaded, loadError];
};

export default useAvailablePvcs;
