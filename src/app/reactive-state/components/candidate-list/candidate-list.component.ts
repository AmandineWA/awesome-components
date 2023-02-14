import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {combineLatest, map, Observable, startWith} from "rxjs";
import {CandidatesService} from "../../services/candidates.service";
import {Candidate} from "../../models/candidate.model";
import {FormBuilder, FormControl} from "@angular/forms";
import {CandidateSearchType} from "../../enums/candidate-search-type.enum";

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateListComponent implements OnInit{

  loading$!: Observable<boolean>;
  candidates$!: Observable<Candidate[]>

  // Deux formControl le champ utilisateur de recherche et le champ type
  searchCtrl!: FormControl;
  serachTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: CandidateSearchType,
    label: string
  }[];

  constructor(
    private candidatesServices: CandidatesService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initObservable();
    this.candidatesServices.getCandidatesFromServer();
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control('');
    this.serachTypeCtrl = this.formBuilder.control(CandidateSearchType.LASTNAME);
    this.searchTypeOptions = [
      { value: CandidateSearchType.LASTNAME, label: 'Nom' },
      { value: CandidateSearchType.FIRSTNAME, label: 'Prénom' },
      { value: CandidateSearchType.COMPANY, label: 'Entreprise'}
    ]
  }

  private initObservable() {
    this.loading$ = this.candidatesServices.loading$;
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    const searchType$: Observable<CandidateSearchType> = this.serachTypeCtrl.valueChanges.pipe(
      startWith(this.serachTypeCtrl.value)
    )
    this.candidates$ = combineLatest([
      search$,
      searchType$,
      this.candidatesServices.candidates$
    ]).pipe(
      map(([search, searchType, candidates]) => candidates.filter(candidate => candidate[searchType]
        .toLowerCase()
        .includes(search as string)))
    );
  }

}
