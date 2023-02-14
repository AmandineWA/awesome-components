import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable, switchMap, take, tap} from "rxjs";
import {Candidate} from "../../models/candidate.model";
import {CandidatesService} from "../../services/candidates.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-single-candidate',
  templateUrl: './single-candidate.component.html',
  styleUrls: ['./single-candidate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleCandidateComponent implements OnInit{

  loading$!: Observable<boolean>;
  candidate$!: Observable<Candidate>;

  constructor(
    private candidatesService : CandidatesService,
    private route: ActivatedRoute,
    private router: Router) {
  }
  ngOnInit(): void {
    this.initObservable();
  }


  private initObservable() {
    this.loading$ = this.candidatesService.loading$;
    this.candidate$ = this.route.params.pipe(
      switchMap(params => this.candidatesService.getCandidateById(+params['id']))
    )
  }

  onHire() {
    // Ajout 'optimiste' on met d'abord à jours les données de l'application avant même d'envoyer la requête au serveur
    this.candidate$.pipe(
      take(1),
      tap(candidate => {
        this.candidatesService.hireCandidate(candidate.id);
        this.onGoBack();
      })
    ).subscribe();
  }

  onRefuse() {
    // suppression 'pessimiste' on attend que la requête réussisse avant de metre à jours les données cotés application
    // on récupère les data du candidat (l'observable)
    // On utilise take() pour que la logique soit éxécutée une seul fois
    // on déclenche la suppression (grace à l'id) et on redirige.
    this.candidate$.pipe(
      take(1),
      tap(candidate => {
        this.candidatesService.refuseCandidate(candidate.id);
        this.onGoBack();
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl('/reactive-state/candidates')
  }
}
