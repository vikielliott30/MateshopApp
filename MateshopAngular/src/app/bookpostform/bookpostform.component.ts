import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MateService } from '../mate.service';
import { Mate } from '../mate.model';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export { MateFormComponent as BookPostFormComponent } from '../mateform/mateform.component';