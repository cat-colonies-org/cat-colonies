Option Compare Database

Sub exportAttachments()

  Dim strPath, fName, fldName, sName(3)  As String
  Dim rsPictures, rsDes  As Variant
  Dim rs As DAO.Recordset
  Dim savedFile, i As Integer
  savedFile = 0

  strPath = Application.CurrentProject.Path

  Set rs = CurrentDb.OpenRecordset("SELECT * FROM GATOS")

  'Check to see if the recordset actually contains rows
  If Not (rs.EOF And rs.BOF) Then
    rs.MoveFirst 'Not required here, but still a good habit
    Do Until rs.EOF = True
      On Error Resume Next 'ignore errors

      'Instantiate the child record set.
      Set rsPictures = rs.Fields("IMÁGEN").Value
      Set rsDes = rs.Fields("Id GATO") 'use to name the picture later

      'if no attachment available, go to next record
      If Len(rsPictures.Fields("FileName")) = 0 Then
        GoTo nextRS
      End If
      If rsPictures.RecordCount <> 0 Then
        rsPictures.MoveLast
        savedFile = rsPictures.RecordCount 'set savedFile = total no of attachments
      End If
      rsPictures.MoveFirst ' move to first attachment file

      'WARNING: all of my attachments are picture with JPG extension.
      'loop through all attachments
      For i = 1 To savedFile 'rename all files and save
        If Not rsPictures.EOF Then
          fName = strPath & "\Attachments\" & rsDes & "_" & i & ".JPG"
          rsPictures.Fields("FileData").SaveToFile fName
          sName(i) = fName 'keep path in an array for later use
          rsPictures.MoveNext
        End If
      Next i

      'insert image name and path into database an edit
      rs.Edit

      If Len(sName(1)) <> 0 Then
        rs!PicPath1 = CStr(sName(1)) 'path
        rs!PicDes1 = Left(Dir(sName(1)), InStr(1, Dir(sName(1)), ".") - 1) 'file name without extension
      End If
      If Len(sName(2)) <> 0 Then
        rs!PicPath2 = CStr(sName(2))
        rs!PicDes2 = Left(Dir(sName(2)), InStr(1, Dir(sName(2)), ".") - 1)
      End If
      If Len(sName(3)) <> 0 Then
        rs!PicPath3 = CStr(sName(3))
        rs!PicDes3 = Left(Dir(sName(3)), InStr(1, Dir(sName(3)), ".") - 1)
      End If

      rs.Update 'update record
 nextRS:
      rsPictures.Close 'close attachment
      savedFile = 0 'reset for next
      fName = 0 'reset

      'Move to the next record.
      rs.MoveNext
    Loop

    Else
    MsgBox "There are no records in the recordset."
  End If

  MsgBox "Attachments were exported!"

  rs.Close 'Close the db recordsets
  Set rs = Nothing 'Clean up

End Sub
